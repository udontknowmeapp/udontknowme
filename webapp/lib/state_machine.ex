defmodule StateMachine do
  require Game

  defstruct game: nil, current_state: "lobby", timer: nil

  def get(sm), do: Agent.get(sm, &(&1))

  def new do
    Agent.start_link(fn -> %StateMachine{} end)
  end

  def read_message(sm, message) do
    message_keys = Map.keys(message) |> Enum.sort
    keys = [:message, :player_name, :player_type]
    cond do
      message_keys === keys -> _read_message(sm, message)
      true -> error_message("Improperly Formatted Message")
    end
  end

  defp _read_message(sm, message) do
    case message[:message] do
      "identify"  -> identify(sm, message)
      "new_game"  -> new_game(sm)
      _           -> do_state(sm, message)
    end
  end

  defp do_state(sm, payload) do
    case get(sm).current_state do
      "lobby"           -> state_lobby(sm, payload)
      "intro"           -> state_intro(sm, payload)
      "question_ask"    -> state_question_ask(sm, payload)
      "question_guess"  -> state_question_guess(sm, payload)
      "show_results"    -> state_show_results(sm, payload)
      "show_points"     -> state_show_points(sm, payload)
      "game_over"       -> state_game_over(sm, payload)
    end
  end

  ### State Functions ###

  defp next_state(sm, state) do
    Agent.update(sm, fn game ->
      Map.merge(game, %{current_state: state})
    end)
    do_state(sm, %{})
  end

  defp perform_state_checks(sm, callbacks), do: _perform_state_checks(sm, callbacks, nil)

  defp _perform_state_checks(_, [], result), do: {:ok, result}
  defp _perform_state_checks(sm, [cb | remainings], result) do
    # NOTE: _perform_state_checks fails in the case below without the module prefix.
    # Likely something to do with an array of clojures, based on the error:
    # ** (CompileError) lib/state_machine.ex:60: undefined function _perform_state_checks/2
    #     (stdlib) lists.erl:1337: :lists.foreach/2
    #     (stdlib) erl_eval.erl:669: :erl_eval.do_apply/6
    case cb.(result) do
      {:continue, result}     -> StateMachine._perform_state_checks(remainings, result)
      {:state_change, state}  -> next_state(sm, state)
    end
  end

  defp new_game(sm) do
    {:ok, game} = Game.new
    Agent.update(sm, &(Map.merge(&1, %{
      game: game,
      current_state: "lobby"
    })))

    message = blank_message
    |> Map.put(:state, get(sm).current_state)
    message = put_in(message[:data][:message], "new_game")
    message = put_in(message[:data][:players], [])

    {:ok, message}
  end

  defp identify(sm, payload) do
    case payload[:player_type] do
      "console" -> do_state(sm, payload)
      "player" ->
        cond do
          get(sm).current_state === 'lobby' ->
            do_state(sm, payload)
          player_in_game?(sm, payload[:name]) ->
            do_state(sm, payload)
          true ->
            error_message("The game has already started. No new players can join.")
        end
      _ -> error_message("Bad Player Type")
    end
  end

  defp state_lobby(sm, payload) do
    %{player_type: type} = payload

    perform_state_checks(sm, [
      # First, add players & potentially trigger the intro
      fn result ->
        cond do
          type === "player" ->
            %{player_name: name, message: message} = payload
            if !StateMachine.player_in_game?(name) do
              get(sm).game |> Game.add_player(name)
            end
            if message === "start" do
              {:state_change, "intro"}
            else
              {:continue, result}
            end
          true -> {:continue, result}
        end
      end,

      # Second, return state snapshot
      fn _ ->
        message = blank_message
        |> Map.put(:state, get(sm).current_state)
        {:continue, put_in(message[:data][:players], get_players(sm))}
      end
    ])
  end

  defp state_intro(sm, payload) do
    %{player_type: type, message: message} = payload

    perform_state_checks(sm, [
      fn result ->
        if type === "console" && message === "intro_complete" do
          get(sm).game |> Game.setup_questions
          get(sm).game |> Game.next_question
          {:state_change, "question_ask"}
        else
          {:continue, result}
        end
      end,

      fn _ ->
        {:continue, Map.merge(blank_message, %{state: Game.get(sm).current_state})}
      end
    ])
  end

  defp state_question_ask(sm, payload) do
    %{player_type: type, player_name: name, message: message} = payload
    q = get(sm).game |> Game.current_question
    question = Question.get(q)

    perform_state_checks(sm, [
      fn result ->
        if type === "system" && message === "timer_over" do
          {:state_change, "question_guess"}
        else
          {:continue, result}
        end
      end,

      fn result ->
        if type === "player" do
          player = get(sm).game |> Game.get_player_by_name(name)
          Question.add_answer(q, player, message)
          cond do
            player === question.about_player ->
              # TODO: Set timer
              {:continue, result}
            Enum.count(question.answers) === get(sm).game |> Game.get |> Enum.count ->
              # TODO: Set timer for next state
              {:state_change, "question_guess"}
            true ->
              {:continue, result}
          end
        else
          {:continue, result}
        end
      end,

      fn _ ->
        message = blank_message
        |> Map.put(:state, get(sm).current_state)
        message = put_in(message[:data][:about], Player.get(question.about_player).name)
        message = put_in(message[:data][:question], question.question)
        message = put_in(message[:data][:submitted_answers], Enum.map(question.answers, &(Player.get(&1.player).name)))
        # TODO: timer
        # put_in(message[:data], :timer, seconds_left)

        {:continue, message}
      end
    ])
  end

  def state_question_guess(sm, payload) do
    %{player_type: type, player_name: name, message: message} = payload
    q = get(sm).game |> Game.current_question
    question = Question.get(q)

    perform_state_checks(sm, [
      fn result ->
        if type === "system" && message === "timer_over" do
          {:state_change, "show_results"}
        else
          {:continue, result}
        end
      end,

      fn result ->
        if type === "player" do
          player = get(sm).game |> Game.get_player_by_name(name)
          Question.add_guess(q, player, message)

          expected_num_guesses = (Game.get(get(sm).game).players |> Enum.count) - 1
          if Question.num_guesses(q) === expected_num_guesses do
            Agent.update(sm, &(Map.merge(&1, %{timer: nil})))
            Question.award_points(q)
            {:state_change, "show_results"}
          else
            {:continue, result}
          end
        else
          {:continue, result}
        end
      end,

      fn _ ->
        message = blank_message
        |> Map.put(:state, get(sm).current_state)

        # TODO: Timer
        # put_in(message[:data], :timer, seconds_left)

        answers = Enum.uniq(question.answers)
        |> Enum.map(fn answer ->
          players = Enum.filter(question.answers, &(&1.answer === answer.answer))
          |> Enum.map(&(Player.get(&1.player).name))
          %{
            answer: answer.answer,
            players: players
          }
        end)
        message = put_in(message[:data][:answers], answers)

        submitted_guesses = Map.values(question.guesses)
        |> Enum.reduce([], fn(guess_list, acc) ->
          for p <- guess_list, do: [Player.get(p).name | acc]
        end)
        message = put_in(message[:data][:submitted_guesses], submitted_guesses)

        {:continue, message}
      end
    ])
  end

  defp state_show_results(sm, payload) do
    %{player_type: type, message: message} = payload
    q = get(sm).game |> Game.current_question
    state = get(sm).current_state

    perform_state_checks(sm, [
      fn result ->
        cond do
          type === "console" && message === "results_complete" -> {:state_change, "show_points"}
          true -> {:continue, result}
        end
      end,

      fn _ ->
        message = blank_message
        |> Map.put(:state, get(sm).current_state)

        who_guessed_what = Question.who_guessed_what(q)
        answers = Stream.with_index(who_guessed_what)
        |> Enum.map(fn result ->
          data = Enum.at(result, 0)
          index = Enum.at(result, 1)
          %{
            answer: data[:answer],
            guessed: data[:guessed_by],
            wrote: [data[:by]],
            truth: if index === Enum.count(who_guessed_what) - 1 do
              true
            else
              false
            end
          }
        end)

        {:continue, put_in(message[:data][:answers], answers)}
      end
    ])
  end

  defp state_show_points(sm, payload) do
    %{player_type: type, message: message} = payload
    perform_state_checks(sm, [
      fn result ->
        if type === "console" && message === "points_complete" do
          game = get(sm).game |> Game.get
          if game.question_index === Enum.count(game.questions) do
            {:state_change, "game_over"}
          else
            {:state_change, "question_ask"}
          end
        else
          {:continue, result}
        end
      end,

      fn _ -> {:continue, results_message(sm)} end
    ])
  end

  defp state_game_over(sm, _), do: {:ok, results_message(sm)}

  ### Helpers ###

  defp player_in_game?(sm, name) do
    Game.get(get(sm).game).players
    |> Enum.find(&(Player.get(&1).name === name))
  end

  defp get_players(sm) do
    Game.get(get(sm).game).players
    |> Enum.map(&(Player.get(&1).name))
  end

  defp error_message(err) do
    message = blank_message
    |> Map.put(:state, "error")
    {:error, put_in(message[:data][:error], err)}
  end

  defp blank_message do
    %{
      state: nil,
      data: %{
        message: nil,
        timer: nil
      }
    }
  end

  defp results_message(sm) do
    # NOTE: message[:state] = get(sm).current_state fails with error:
    # ** (CompileError) lib/state_machine.ex:330: cannot invoke remote function Access.get/2 inside match
    message = blank_message
    |> Map.put(:state, get(sm).current_state)

    by_points = get(sm).game
    |> Game.players_sorted_by_points
    |> Enum.map(&(Player.get(&1)))

    put_in(message[:data][:points], by_points)
  end
end

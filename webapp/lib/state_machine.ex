defmodule StateMachine do
  use Timex
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
    Agent.update(sm, fn game -> %{game | current_state: state} end)
    do_state(sm, %{})
  end

  defp new_game(sm) do
    {:ok, game} = Game.new
    Agent.update(sm, &(%{
      &1 |
      game: game,
      current_state: "lobby"
    }))

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
          get(sm).current_state === "lobby" ->
            do_state(sm, payload)
          player_in_game?(sm, payload[:name]) ->
            do_state(sm, payload)
          true ->
            error_message("The game has already started. No new players can join.")
        end
      _ -> error_message("Bad Player Type")
    end
  end

  defp state_lobby(sm, %{player_type: "player", message: "start"}), do: next_state(sm, "intro")
  defp state_lobby(sm, %{player_type: "player", player_name: name}) do
    if !player_in_game?(sm, name) do
      get(sm).game |> Game.add_player(name)
    end
    state_lobby(sm, %{})
  end
  defp state_lobby(sm, _) do
    message = blank_message
    |> Map.put(:state, get(sm).current_state)
    message = put_in(message[:data][:players], get_players(sm))

    {:ok, message}
  end

  defp state_intro(sm, %{player_type: "console", message: "intro_complete"}) do
    game = get(sm).game
    Game.setup_questions(game)
    Game.next_question(game)

    next_state(sm, "question_ask")
  end
  defp state_intro(sm, _), do: {:ok, %{blank_message | state: get(sm).current_state}}

  defp state_question_ask(sm, %{player_type: "system", message: "timer_over"}), do: next_state(sm, "question_guess")
  defp state_question_ask(sm, %{player_type: "player", message: message}) do
    %{game: game} = get(sm)
    player = Game.get_player_by_name(game)
    question = Game.current_question(game) |> Question.get

    Game.current_question(game)
    |> Question.add_answer(player, message)

    cond do
      Enum.count(question.answers) === Game.get(game) |> Enum.count ->
        Agent.update(sm, &(%{&1 | timer: Time.now}))
        next_state(sm, "question_guess")
      player === question.about_player ->
        Agent.update(sm, &(%{&1 | timer: Time.now}))
        state_question_ask(sm, %{})
      true -> state_question_ask(sm, %{})
    end
  end
  defp state_question_ask(sm, _) do
    %{game: game, current_state: state} = get(sm)
    question = Game.current_question(game) |> Question.get

    message = blank_message
    |> Map.put(:state, state)
    message = put_in(message[:data][:about], Player.get(question.about_player).name)
    message = put_in(message[:data][:question], question.question)
    message = put_in(message[:data][:submitted_answers], Enum.map(question.answers, &(Player.get(&1.player).name)))
    message = put_in(message[:data], :timer, seconds_left(sm))

    {:ok, message}
  end

  defp state_question_guess(sm, %{player_type: "system", message: "timer_over"}) do
    get(sm).game
    |> Game.current_question
    |> Question.award_points

    next_state(sm, "show_results")
  end
  defp state_question_guess(sm, %{player_type: "player", message: message}) do
    %{game: game} = get(sm)
    player = Game.get_player_by_name(game)
    q = Game.current_question(game)

    Question.add_guess(q, player, message)

    expected_num_guesses = (Game.get(game).players |> Enum.count) - 1
    if Question.num_guesses(q) === expected_num_guesses do
      Agent.update(sm, &(%{&1 | timer: nil}))
      Question.award_points(q)
      next_state(sm, "show_results")
    else
      state_question_guess(sm, %{})
    end
  end
  defp state_question_guess(sm, _) do
    question = get(sm).game
    |> Game.current_question
    |> Question.get

    message = blank_message
    |> Map.put(:state, get(sm).current_state)

    message = put_in(message[:data], :timer, seconds_left(sm))

    # For each unique answer, get a list of players that submitted
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

    # Get list of all players who have submitted aanswers across all answers
    submitted_guesses = Map.values(question.guesses)
    |> Enum.reduce([], fn(guess_list, acc) ->
      for p <- guess_list, do: [Player.get(p).name | acc]
    end)
    message = put_in(message[:data][:submitted_guesses], submitted_guesses)

    {:ok, message}
  end

  defp state_show_results(sm, %{player_type: "console", message: "results_complete"}), do: next_state(sm, "show_points")
  defp state_show_results(sm, _) do
    message = blank_message
    |> Map.put(:state, get(sm).current_state)

    who_guessed_what = get(sm).game
    |> Game.current_question
    |> Question.who_guessed_what

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

    message = put_in(message[:data][:answers], answers)
    {:ok, message}
  end

  defp state_show_points(sm, %{player_type: "console", message: "points_complete"}) do
    game = get(sm).game |> Game.get
    if game.question_index === Enum.count(game.questions) do
      next_state(sm, "game_over")
    else
      next_state(sm, "question_ask")
    end
  end
  defp state_show_points(sm, _), do: {:ok, results_message(sm)}

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
    %{game: game, current_state: state} = get(sm)
    message = blank_message
    |> Map.put(:state, state)

    by_points = Game.players_sorted_by_points(game)
    |> Enum.map(&(Player.get(&1)))

    message = put_in(message[:data][:points], by_points)
    message
  end

  defp seconds_left(sm) do
    %{timer: timer} = get(sm)
    Time.diff(Time.now, timer, :seconds)
  end
end

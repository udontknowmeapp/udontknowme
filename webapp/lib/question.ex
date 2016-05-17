defmodule Answer do
  defstruct player: nil, answer: nil
end

defmodule Question do
  require Player

  defstruct question: nil,
            about_player: nil,
            points_tricking: 500,
            points_correct: 1000,
            answers: [],  # %Answer{}
            guesses: %{} # %{"answer" => ["name",...]}

  def get(q), do: Agent.get(q, &(&1))

  def new(title, about) do
    Agent.start_link(fn -> %Question{question: title, about_player: about} end)
  end

  @doc """
  Adds a new %Answer{} for guessing to the %Question{} state, along with an empty
  guesses list. The guesses list key is a string reference to the answer.
  """
  def add_answer(q, player, text) do
    Agent.update(q, fn question ->
      Map.merge(question, %{
        answers: question.answers ++ [%Answer{player: player, answer: text}],
        guesses: Map.merge(question.guesses, %{text => []})
      })
    end)
  end

  @doc """
  Adds the given player's reference to the guesses list for an answer, but
  only if the given player does not own any instance of this answer
  """
  def add_guess(q, player, text) do
    answers = get(q).answers
    |> Enum.filter(&(&1.answer === text))

    answer = List.first(answers)
    if !Enum.any?(answers, &(&1.player === player)) do
      Agent.update(q, fn question ->
        guesses = Map.merge(
          question.guesses,
          %{answer.answer => question.guesses[answer.answer] ++ [player]}
        )
        Map.put(question, :guesses, guesses)
      end)
    end
  end

  @doc "Gets total guesses for all answers currently in state"
  def num_guesses(q) do
    get(q).guesses
    |> Map.values
    |> Enum.reduce(0, &(&2 + Enum.count(&1)))
  end

  @doc """
  Returns a list of maps, each one containing info about answer guesses. The
  last item will contain info for the about answer
  """
  def who_guessed_what(q) do
    question = get(q)
    answer_by_about_player = question.answers
    |> Enum.find(&(&1.player === question.about_player))

    Enum.filter_map(question.answers,
      fn a ->
        a_player = Player.get(a.player)
        about_player = Player.get(question.about_player)
        a_player.name !== about_player.name
      end,
      fn a -> get_answers_map(question, a) end
    )
    |> Enum.sort_by(&(Enum.count(&1.guessed_by)))
    |> Enum.concat([get_answers_map(question, answer_by_about_player)])
  end

  # TODO: Tests
  @doc "Returns all answers with the given answer string"
  def answers_with_text(q, text) do
    Question.get(q).answers
    |> Enum.filter(&(&1.answer === text))
  end

  @doc "Loops through guesses & awards points based on info in each"
  def award_points(q) do
    question = get(q)
    Map.keys(question.guesses)
    |> Enum.each(fn answer ->
      if Enum.count(question.guesses[answer]) > 0 do
        _award_points(question, answer)
      end
    end)
  end

  # Handles five different guess results cases
  # * 1 Answer && About Answer -> award correct points logic
  # * 1 Answer && ! About Answer -> award trick points logic
  # * Mult. Answers && About Answer -> award correct pointslogic only for the about answer
  # * Mult. Answers && ! About Answer -> award trick points logic to each answer owner
  # * No Guesses -> do nothing
  defp _award_points(question, answer_text) do
    answers = Enum.filter(question.answers, &(&1.answer === answer_text))
    cond do
      Enum.count(answers) === 1 && List.first(answers).player === question.about_player ->
        add_correct_points(question, answer_text)

      Enum.count(answers) === 1 ->
        add_trick_points(question, List.first(answers))

      Enum.count(answers) >= 1 && Enum.filter(answers, &(&1.player === question.about_player)) |> Enum.count === 1 ->
        answer = Enum.find(question.answers, &(&1.answer === answer_text))
        add_correct_points(question, answer.answer)

      Enum.count(answers) >= 1 ->
        Enum.each(answers, &(add_trick_points(question, &1)))

      true -> nil
    end
  end

  # Each player who guesses correctly gets the points_correct value. The about
  # player gets points_correct for each guess they receive!
  defp add_correct_points(question, answer_text) do
    Enum.each(question.guesses[answer_text], fn player ->
      Player.add_points(player, question.points_correct)
    end)
    Player.add_points(
      question.about_player,
      num_guesses_for(question, answer_text) * question.points_correct
    )
  end

  # The answer owner gets points_tricking for each tricked guess
  defp add_trick_points(question, answer) do
    Player.add_points(answer.player, num_guesses_for(question, answer.answer) * question.points_tricking)
  end

  defp num_guesses_for(question, answer_text), do: Enum.count(question.guesses[answer_text])

  defp get_answers_map(question, answer) do
    %{
      by: Player.get(answer.player).name,
      answer: answer.answer,
      guessed_by: Enum.map(question.guesses[answer.answer], &(Player.get(&1).name))
    }
  end
end

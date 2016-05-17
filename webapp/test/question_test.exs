defmodule QuestionTest do
  use ExUnit.Case
  doctest Udkm

  setup do
    {:ok, billy}   = Player.new("Billy")
    {:ok, rachel}  = Player.new("Rachel")
    {:ok, greg}    = Player.new("Greg")
    {:ok, sylvia}  = Player.new("Sylvia")
    {:ok, ian}     = Player.new("Ian")
    {:ok, david}   = Player.new("David")

    question = "Favorite color?"
    {:ok, q} = Question.new(question, billy)

    Question.add_answer(q, billy,   "It's blue, duh!")
    Question.add_answer(q, rachel,  "I bet it's red")
    Question.add_answer(q, greg,    "It's blue, duh!")
    Question.add_answer(q, sylvia,  "Black like your soul")
    Question.add_answer(q, ian,     "Orange?")
    Question.add_answer(q, david,   "I bet it's red")

    Question.add_guess(q, rachel, "It's blue, duh!")
    Question.add_guess(q, greg, "Black like your soul")
    Question.add_guess(q, sylvia, "It's blue, duh!")
    Question.add_guess(q, ian, "I bet it's red")
    Question.add_guess(q, david, "I bet it's red")

    {:ok, [
      q: q,
      about: billy,
      question: question,
      players: [rachel, greg, sylvia, ian, david]
    ]}
  end

  ### Question.new/2 ###

  test "it creates a new Question with proper default state", context do
    %{q: q, about: about, question: question} = context

    assert Question.get(q).question === question, "Question string is assigned"
    assert Question.get(q).about_player === about, "Question about is assigned"
    assert Question.get(q).points_tricking === 500, "Question.points_tricking defaults to 500"
    assert Question.get(q).points_correct === 1000, "Question.points_correct defaults to 1000"
  end

  ### Question.add_answer/3 ###
  # TODO: Player refactor

  test "it adds an answer with the right values", context do
    %{q: q, about: about} = context
    answer = Question.get(q).answers |> Enum.find(&(&1.player === about))

    assert answer != nil, "Answer exists"
    assert answer.player === about, "Answer is set with right player owner"
    assert answer.answer === "It's blue, duh!", "Answer is set with right text"
  end

  test "it adds a new guess item to the guesses map on add answer", context do
    %{q: q} = context

    %{guesses: guesses} = Question.get(q)
    assert Map.keys(guesses) |> Enum.count === 4, "There is one key for each"
    assert Map.has_key?(guesses, "It's blue, duh!"), "It has a list for 'It's blue, duh!"
    assert Map.has_key?(guesses, "I bet it's red"), "It has a list for 'I bet it's red"
    assert Map.has_key?(guesses, "Black like your soul"), "It has a list for 'Black like your soul"
    assert Map.has_key?(guesses, "Orange?"), "It has a list for 'Orange?"
  end

  test "it doesn't add a new guess item if it already exists", context do
    %{q: q} = context

    guesses_for_blue = Question.get(q).guesses
    |> Map.keys
    |> Enum.filter(&(&1 === "It's blue, duh!"))
    |> Enum.count

    assert guesses_for_blue === 1, "There's only one guess List per unique answer string"
  end

  ### Question.add_guess/3 ###

  test "it adds the player's name to the guesses list for the answer on guess", context do
    %{q: q, players: players} = context
    rachel = List.first(players)

    contains_rachel = Question.get(q).guesses["It's blue, duh!"]
    |> Enum.find(&(&1 === rachel))

    assert contains_rachel, "Player exists in guesses List"
  end

  test "it doesn't add the player's name to the guesses list if they own the answer", context do
    %{q: q, players: players} = context
    david = List.last(players)

    no_david = Question.get(q).guesses["I bet it's red"]
    |> Enum.find(&(&1 === david))

    assert !no_david, "Player isn't included in own answer guesses"
  end

  ### Question.num_guesses/1 ###

  test "it returns the correct total of guesses", context do
    %{q: q} = context
    assert Question.num_guesses(q) === 4
  end

  ### Question.who_guessed_what/1 ###

  test "it returns a Map for each answer with the appropriate parameters", context do
    %{q: q} = context
    res = [
      %{answer: "Orange?", by: "Ian", guessed_by: []},
      %{answer: "I bet it's red", by: "Rachel", guessed_by: ["Ian"]},
      %{answer: "Black like your soul", by: "Sylvia", guessed_by: ["Greg"]},
      %{answer: "I bet it's red", by: "David", guessed_by: ["Ian"]},
      %{answer: "It's blue, duh!", by: "Greg", guessed_by: ["Rachel", "Sylvia"]},
      %{answer: "It's blue, duh!", by: "Billy", guessed_by: ["Rachel", "Sylvia"]}
    ]

    assert Question.who_guessed_what(q) === res
  end

  test "it returns an empty guessed_by List if no guesses for the answer", context do
    %{q: q} = context

    %{guessed_by: guessed_by} = Question.who_guessed_what(q)
    |> List.first

    assert guessed_by === [], "It should be empty"
  end

  test "the about answer is the last in the List of Maps", context do
    %{q: q, about: about} = context

    %{by: by} = Question.who_guessed_what(q)
    |> Enum.reverse
    |> List.first

    assert by === Player.get(about).name, "The last item should be the about answer"
  end

  ### Question.add_points/1 ###

  test "it awards each player the expected points", context do
    %{
      q: q,
      about: about,
      players: [rachel, greg, sylvia, ian, david]
    } = context

    Question.award_points(q)
    assert Player.get(about).points === 2000
    assert Player.get(rachel).points === 1500
    assert Player.get(greg).points === 0
    assert Player.get(sylvia).points === 1500
    assert Player.get(ian).points === 0
    assert Player.get(david).points === 500
  end

  test "it awards correct points if one answer for the guess && it's the about answer", context do
    %{q: q, about: about} = context
    Question.award_points(q)
    assert Player.get(about).points === 2000
  end

  test "it awards trick points if one answer && it's not the about answer", context do
    %{q: q, players: players} = context
    Question.award_points(q)
    assert Player.get(Enum.at(players, 2)).points === 1500
  end

  test "it awards correct points to only the about player if multiple answers && one is the about answer", context do
    %{q: q, players: players} = context
    Question.award_points(q)
    assert Player.get(Enum.at(players, 1)).points === 0
  end

  test "it awards trick points to for each answer if multiple && none are the about answer", context do
    %{q: q, players: players} = context
    Question.award_points(q)
    assert Player.get(List.first(players)).points === 1500
    assert Player.get(List.last(players)).points === 500
  end
end

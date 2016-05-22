defmodule GameTest do
  use ExUnit.Case
  doctest Udkm

  setup do
    {:ok, g} = Game.new
    Game.add_player(g, "Billy")
    Game.add_player(g, "Rachel")
    Game.add_player(g, "Greg")

    points = 500
    players = Game.get(g).players
    Enum.each(0..Enum.count(players) - 1, fn i ->
      Enum.at(players, i)
      |> Player.add_points(points * i)
    end)

    {:ok, [g: g]}
  end

  ### Game.new/0 ###

  test "it creates a blank %Game{} on new" do
    {:ok, g} = Game.new
    assert Game.get(g).players === [], "It starts with an empty players list"
    assert Game.get(g).questions === [], "It starts with an empty questions list"
    assert Game.get(g).question_index === -1, "It starts with a -1 index"
  end

  ### Game.add_player/2 ###

  test "it adds a player as expected" do
    {:ok, g} = Game.new
    Game.add_player(g, "Billy")
    player = Game.get(g).players
    |> List.first
    |> Player.get

    assert player.name === "Billy"
  end

  ### Game.get_player_by_name/2 ###

  test "it finds a player by their name" do
    {:ok, g} = Game.new
    Game.add_player(g, "Billy")
    Game.add_player(g, "Bobby")
    assert Game.get_player_by_name(g, "Billy").name === "Billy"
  end

  ### Game.setup_questions/1 ###

  test "it adds two questions for each player", context do
    %{g: g} = context
    Game.setup_questions(g)

    questions = Game.get(g).questions |> Enum.map(&(Question.get(&1)))

    assert Enum.count(questions) === 6
    assert Enum.filter(questions, &(Player.get(&1.about_player).name === "Billy")) |> Enum.count === 2
    assert Enum.filter(questions, &(Player.get(&1.about_player).name === "Rachel")) |> Enum.count === 2
    assert Enum.filter(questions, &(Player.get(&1.about_player).name === "Greg")) |> Enum.count === 2
  end

  ### Game.current_question/1 ###

  test "it returns `nil` if question index is -1" do
    {:ok, g} = Game.new
    assert Game.current_question(g) === nil
  end

  test "it returns the current question if the index >= 0", context do
    %{g: g} = context
    Game.setup_questions(g)
    result = Game.next_question(g)
    assert Question.get(Game.current_question(g)).question === result.question
  end

  ### Game.next_question/1 ###

  test "returns the next question", context do
    %{g: g} = context
    Game.setup_questions(g)
    Game.next_question(g)

    should_be_next = Enum.at(Game.get(g).questions, Game.get(g).question_index + 1)
    |> Question.get
    next = Game.next_question(g)

    assert should_be_next === next
  end

  test "it increments the question index before returning the next question", context do
    %{g: g} = context
    Game.setup_questions(g)

    previous_index = Game.get(g).question_index
    Game.next_question(g)
    next_index = Game.get(g).question_index

    assert previous_index === -1
    assert next_index === 0
  end

  ### Game.players_sorted_by_points/1 ###

  test "it returns players sorted descending by points", context do
    %{g: g} = context
    sorted = Game.players_sorted_by_points(g)
    |> Enum.map(&(Player.get(&1).name))

    assert Enum.at(sorted, 0) === "Greg"
    assert Enum.at(sorted, 1) === "Rachel"
    assert Enum.at(sorted, 2) === "Billy"
  end
end

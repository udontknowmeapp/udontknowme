defmodule Game do
  import QuestionsList

  require Question
  require Player

  defstruct players: [], questions: [], question_index: -1

  def new do
    Agent.start_link(fn -> %Game{} end)
  end

  def get(g), do: Agent.get(g, &(&1))

  def add_player(g, name) do
    Agent.update(g, fn game ->
      {:ok, new_player} = Player.new(name)
      %{game | players: game.players ++ [new_player]}
    end)
  end

  def get_player_by_name(g, name) do
    get(g).players
    |> Enum.find(&(Player.get(&1).name === name))
    |> Player.get
  end

  def setup_questions(g) do
    num_players = get(g).players |> Enum.count
    double_players = get(g).players ++ get(g).players
    questions = Enum.take_random(get_list, num_players * 2)

    Agent.update(g, fn game ->
      %{
        game |
        questions: (0..Enum.count(double_players) - 1) |> Enum.map(fn i ->
          {:ok, q} = Question.new(Enum.at(questions, i), Enum.at(double_players, i))
          q
        end)
      }
    end)
  end

  def current_question(g) do
    current_game = get(g)
    if current_game.question_index >= 0 do
      Enum.at(current_game.questions, current_game.question_index)
    else
      nil
    end
  end

  def next_question(g) do
    Agent.update(g, fn game -> %{game | question_index: game.question_index + 1} end)
    game = get(g)
    Enum.at(game.questions, game.question_index)
    |> Question.get
  end

  def players_sorted_by_points(g) do
    get(g).players
    |> Enum.sort_by(&(Player.get(&1).points), &>=/2)
  end
end

defmodule StateMachineTest do
  use ExUnit.Case
  doctest Udkm

  setup do
    {:ok, sm} = StateMachine.new
    {:ok, [sm: sm]}
  end

  def new_game(sm) do
    StateMachine.read_message(sm, %{
      message: "new_game",
      player_name: nil,
      player_type: "console"
    })
  end

  ### StateMachine.new/0 ###

  test "it starts the state machine with default data", context do
    %{sm: sm} = context
    machine = StateMachine.get(sm)

    assert machine.game === nil, "it should start with a `nil` game"
    assert machine.current_state === "lobby", "it should start with a state of `lobby`"
    assert machine.timer === nil, "it should start with a `nil` timer"
  end

  ### StateMachine.read_message/2 ###

  test "it returns an error for an invalid message", context do
    %{sm: sm} = context
    {:error, message} = StateMachine.read_message(sm, %{message: "Howdy"})

    assert message[:state] === "error", "it returns with an error state"
    assert message[:data][:error] === "Improperly Formatted Message"
  end

  ### StateMachine.new_game/1 (private, via StateMachine.read_message/2) ###

  test "it starts a new game", context do
    %{sm: sm} = context
    {:ok, result} = new_game(sm)

    assert result[:state] === "lobby", "it should remain in the lobby state"
    assert result[:data][:message] === "new_game", "it should say a new game started"
    assert result[:data][:players] === [], "it should start with an empty players List"

    current_game = StateMachine.get(sm).game |> Game.get
    assert current_game === %Game{}, "the game itself starts with defaults"
  end

  ### StateMachine.identify/2 (private, via StateMachine.read_message/2) ###

  test "it performs the current_state logic if player_type === `console`", context do
    %{sm: sm} = context
    {:ok, _} = new_game(sm)
    {:ok, result} = StateMachine.read_message(sm, %{
      message: "identify",
      player_name: nil,
      player_type: "console"
    })

    assert result[:state] === "lobby", "it stays in the lobby state"
    assert result[:data][:players] === [], "it returns the (empty) players List"
  end

  test "it performs the current_state logic if player_type === `player` && state === `lobby`", context do
    %{sm: sm} = context
    {:ok, _} = new_game(sm)
    {:ok, result} = StateMachine.read_message(sm, %{
      message: "identify",
      player_name: "Billy",
      player_type: "player"
    })

    assert result[:state] === "lobby", "it stays in the lobby state"
    assert result[:data][:players] === ["Billy"], "it adds the new player to the game"
  end

  test "it performs the current_state logic if player is in game", context do
    %{sm: sm} = context
    {:ok, _} = new_game(sm)
    {:ok, _} = StateMachine.read_message(sm, %{
      message: "identify",
      player_name: "Billy",
      player_type: "player"
    })
    {:ok, result} = StateMachine.read_message(sm, %{
      message: "identify",
      player_name: "Billy",
      player_type: "player"
    })

    assert result[:state] === "lobby", "it stays in lobby state"
    assert result[:data][:players] === ["Billy"], "it only adds Billy to the game once"
  end

  test "it errors out if the game is started and player not in game" do
    # TODO: Need to update next state to check
  end

  test "it errors out if invalid player type", context do
    %{sm: sm} = context
    {:error, message} = StateMachine.read_message(sm, %{
      message: "identify",
      player_type: "invalid",
      player_name: nil
    })

    assert message[:data][:error] === "Bad Player Type"
  end

  ### StateMachine.state_lobby/2 (private, via StateMachine.read_message/2) ###

  test "it adds the player to the game if they don't exist & continues" do

  end

  test "it moves to the intro state if via player && the message is `start`" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_intro/2 (private, via StateMachine.read_message/2) ###

  test "it sets up questions & moves to the `question_ask` state if via console and `intro_complete`" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_question_ask/2 (private, via StateMachine.read_message/2) ###

  test "it moves to `question_guess` if via system && `timer_over`" do

  end

  test "it adds an answer if via player" do

  end

  test "it sets the timer if via player && the player is the about player" do

  end

  test "it moves to `question_guess` and sets the next timer if all players have answered" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_question_guess/2 (private, via StateMachine.read_message/2) ###

  test "it moves to `show_results` if via system && `timer_over`" do

  end

  test "it adds a guess if via player" do

  end

  test "it sets the timer to `nil`, awards points, and moves to `show_results` if all guesses received" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_show_results/2 (private, via StateMachine.read_message/2) ###

  test "it moves to `show_points` if via console && `results_complete`" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_show_points/2 (private, via StateMachine.read_message/2) ###

  test "it moves to `game_over` if via console && no more questions" do

  end

  test "it moves to `question_ask` (next question) if via console && questions left" do

  end

  test "it continues to return a message if all callbacks complete" do

  end

  ### StateMachine.state_game_over/2 (private, via StateMachine.read_message/2) ###

  test "it continues to return a message if all callbacks complete" do

  end
end

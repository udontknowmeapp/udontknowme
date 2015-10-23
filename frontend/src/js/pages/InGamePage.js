import React, { Component, PropTypes } from 'react';
import LobbyComponent from '../components/in-game/LobbyComponent';
import QuestionComponent from '../components/in-game/QuestionComponent';
import GuessingComponent from '../components/in-game/GuessingComponent';
import states from '../constants/stateConstants';

export default class InGamePage extends Component {

  static propTypes = {
    // ReactRouter props
    history: PropTypes.object,

    // app props
    app: PropTypes.shape({
      appState: PropTypes.string,
      question: PropTypes.string,
      answers: PropTypes.array,
    }),

    // player props
    player: PropTypes.shape({
      playerName: PropTypes.string,
      aboutMe: PropTypes.bool,
      answerSubmitted: PropTypes.bool,
      guessSubmitted: PropTypes.bool,
    }),

    // gameConsole props
    gameConsole: PropTypes.shape({
      players: PropTypes.array
    }),

    // playerActions props
    startGame: PropTypes.func,
    submitAnswer: PropTypes.func,
    submitGuess: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.transitionIfNotPlayer();
  }

  componentDidUpdate() {
    this.transitionIfNotPlayer();
  }

  render() {
    const { app } = this.props;

    switch(app.appState) {
      case states.INIT:
      case states.LOBBY:
        return this.renderLobby();
        break;
      case states.INTRO:
        return this.renderIntroHold();
        break;
      case states.QUESTION_ASK:
        return this.renderQuestionAsk();
        break;
      case states.QUESTION_GUESS:
        return this.renderQuestionGuess();
        break;
      case states.SHOW_RESULTS:
      case states.SHOW_POINTS:
        return this.renderResults();
        break;
    }
  }

  renderLobby() {
    const { player, gameConsole, startGame } = this.props;

    return (
      <span>
        <LobbyComponent
          playerName={player.playerName}
          players={gameConsole.players}
          startGame={startGame}
        />
      </span>
    );
  }

  renderIntroHold() {
    return (
      <span>
        <h1>Game starting, please hold...</h1>
      </span>
    );
  }

  renderQuestionAsk() {
    const { app, player, submitAnswer } = this.props;

    return (
      <span>
        <QuestionComponent
          question={app.question}
          aboutMe={player.aboutMe}
          playerName={player.playerName}
          answerSubmitted={player.answerSubmitted}
          submitAnswer={submitAnswer}
        />
      </span>
    );
  }

  renderQuestionGuess() {
    const { app, player, submitGuess } = this.props;

    return (
      <span>
        <GuessingComponent
          answers={app.answers}
          aboutMe={player.aboutMe}
          guessSubmitted={player.guessSubmitted}
          playerName={player.playerName}
          submitGuess={submitGuess}
        />
      </span>
    );
  }

  renderResults() {
    return (
      <span>
        <h1>Hang tight for this round's results!</h1>
      </span>
    );
  }

  transitionIfNotPlayer() {
    const { player, history } = this.props;
    if (!player.playerName) {
      history.pushState(null, '/');
    }
  }
}

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import LobbyComponent from '../components/in-game/LobbyComponent';
import QuestionComponent from '../components/in-game/QuestionComponent';
import GuessingComponent from '../components/in-game/GuessingComponent';
import GameOverComponent from '../components/in-game/GameOverComponent';
import states from '../constants/stateConstants';
import {
  startGame,
  submitAnswer,
  submitGuess
} from '../actions/PlayerActions';
import { startNewGame } from '../actions/AppActions';

export default class InGamePage extends Component {

  static propTypes = {
    // ReactRouter props
    history: PropTypes.object,

    // app props
    dispatch: PropTypes.func,
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
      players: PropTypes.array,
      questionAbout: PropTypes.string,
    })
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
      case states.GAME_OVER:
        return this.renderGameOver();
        break;
    }
  }

  renderLobby() {
    const { player, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ startGame }, dispatch);

    return (
      <span>
        <LobbyComponent
          playerName={player.playerName}
          players={gameConsole.players}
          actions={actions}
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
    const { app, player, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ submitAnswer }, dispatch);

    return (
      <span>
        <QuestionComponent
          question={app.question}
          aboutMe={player.aboutMe}
          questionAbout={gameConsole.questionAbout}
          playerName={player.playerName}
          answerSubmitted={player.answerSubmitted}
          actions={actions}
        />
      </span>
    );
  }

  renderQuestionGuess() {
    const { app, player, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ submitGuess }, dispatch);

    return (
      <span>
        <GuessingComponent
          answers={app.answers}
          aboutMe={player.aboutMe}
          questionAbout={gameConsole.questionAbout}
          guessSubmitted={player.guessSubmitted}
          playerName={player.playerName}
          actions={actions}
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

  renderGameOver() {
    const { dispatch } = this.props;
    const actions = bindActionCreators({ startNewGame }, dispatch);
    return <GameOverComponent startNewGame={actions.startNewGame} />;
  }

  transitionIfNotPlayer() {
    const { player, history } = this.props;
    if (!player.playerName) {
      history.pushState(null, '/');
    }
  }
}

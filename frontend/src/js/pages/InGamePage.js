import React, { Component, PropTypes } from 'react';
import LobbyComponent from '../components/in-game/LobbyComponent';
import QuestionComponent from '../components/in-game/QuestionComponent';
import GuessingComponent from '../components/in-game/GuessingComponent';
import states from '../constants/stateConstants';

export default class InGamePage extends Component {

  static propTypes = {
    // ReactRouter props
    history: PropTypes.object,

    // AppStore props
    conn: PropTypes.object,
    appState: PropTypes.string,
    question: PropTypes.string,
    answers: PropTypes.array,

    // PlayerStore props
    playerName: PropTypes.string,
    aboutMe: PropTypes.bool,
    answerSubmitted: PropTypes.bool,
    guessSubmitted: PropTypes.bool,

    // GameConsoleStore props
    players: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.transitionIfNotPlayer();
  }

  componentDidUpdate() {
    this.transitionIfNotPlayer();
  }

  render() {
    const { appState } = this.props;

    switch(appState) {
      case states.INIT:
        return this.renderLobby();
        break;
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
        return this.renderResults();
        break;
      case states.SHOW_POINTS:
        return this.renderResults();
        break;
    }
  }

  renderLobby() {
    const { conn, playerName, players } = this.props;

    return (
      <span>
        <LobbyComponent
          conn={conn}
          playerName={playerName}
          players={players}
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
    const {
      question,
      aboutMe,
      playerName,
      answerSubmitted,
      conn
    } = this.props;

    return (
      <span>
        <QuestionComponent
          question={question}
          aboutMe={aboutMe}
          playerName={playerName}
          answerSubmitted={answerSubmitted}
          conn={conn}
        />
      </span>
    );
  }

  renderQuestionGuess() {
    const {
      answers,
      aboutMe,
      guessSubmitted,
      playerName,
      conn
    } = this.props;

    return (
      <span>
        <GuessingComponent
          answers={answers}
          aboutMe={aboutMe}
          guessSubmitted={guessSubmitted}
          playerName={playerName}
          conn={conn}
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
    const { playerName, history } = this.props;
    if (!playerName) {
      history.pushState(null, '/');
    }
  }
}

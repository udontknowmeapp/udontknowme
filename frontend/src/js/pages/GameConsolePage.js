import React, { Component, PropTypes } from 'react';
import states from '../constants/stateConstants';
import ConsoleActions from '../actions/ConsoleActions';
import GameLobby from '../components/game-console/GameLobby';
import QuestionComponent from '../components/game-console/QuestionComponent';
import GuessesComponent from '../components/game-console/GuessesComponent';
import ResultsComponent from '../components/game-console/ResultsComponent';

export default class GameConsolePage extends Component {

  static propTypes = {
    // AppStore props
    conn: PropTypes.object,
    appState: PropTypes.string,
    question: PropTypes.string,
    answers: PropTypes.array,

    // GameConsoleStore props
    players: PropTypes.array,
    questionAbout: PropTypes.string,
    submittedAnswers: PropTypes.array,
    submittedGuesses: PropTypes.array,
    guessResults: PropTypes.array,
    points: PropTypes.array
  }

  constructor(props) {
    super(props);

    const { conn } = this.props;
    ConsoleActions.identify(conn);
  }

  render() {
    const { appState } = this.props;

    if (appState === states.INIT || appState === states.LOBBY || appState === states.INTRO) {
      return this.renderLobby();
    } else if (appState === states.QUESTION_ASK) {
      return this.renderQuestionAsk();
    } else if (appState === states.QUESTION_GUESS) {
      return this.renderQuestionGuess();
    } else if (appState === states.SHOW_RESULTS || appState === states.SHOW_POINTS) {
      return this.renderResults();
    }
  }

  renderLobby() {
    const { players, appState, conn } = this.props;
    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GameLobby
            conn={conn}
            appState={appState}
            players={players}
          />
        </div>
      </div>
    );
  }

  renderQuestionAsk() {
    const {
      conn,
      timer,
      question,
      questionAbout,
      submittedAnswers
    } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <QuestionComponent
            conn={conn}
            timer={timer}
            question={question}
            about={questionAbout}
            submittedAnswers={submittedAnswers}
          />
        </div>
      </div>
    );
  }

  renderQuestionGuess() {
    const {
      conn,
      timer,
      question,
      answers,
      submittedGuesses
    } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GuessesComponent
            conn={conn}
            timer={timer}
            question={question}
            answers={answers}
            submittedGuesses={submittedGuesses}
          />
        </div>
      </div>
    );
  }

  renderResults() {
    const {
      question,
      guessResults,
      points,
      conn,
      questionAbout,
      appState
    } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <ResultsComponent
            appState={appState}
            conn={conn}
            question={question}
            guessResults={guessResults}
            points={points}
            questionAbout={questionAbout}
          />
        </div>
      </div>
    );
  }
}

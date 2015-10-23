import React, { Component, PropTypes } from 'react';
import states from '../constants/stateConstants';
import ConsoleActions from '../actions/ConsoleActions';
import GameLobby from '../components/game-console/GameLobby';
import QuestionComponent from '../components/game-console/QuestionComponent';
import GuessesComponent from '../components/game-console/GuessesComponent';
import ResultsComponent from '../components/game-console/ResultsComponent';

export default class GameConsolePage extends Component {

  static propTypes = {
    // app props
    app: PropTypes.shape({
      appState: PropTypes.string,
      question: PropTypes.string,
      answers: PropTypes.array
    }),

    // gameConsole props
    gameConsole: PropTypes.shape({
      players: PropTypes.array,
      questionAbout: PropTypes.string,
      submittedAnswers: PropTypes.array,
      submittedGuesses: PropTypes.array,
      guessResults: PropTypes.array,
      points: PropTypes.array,
      timer: PropTypes.number
    }),

    // consoleActions props
    resetTimer: PropTypes.func,
    startTimer: PropTypes.func,
    identify: PropTypes.func,
    introCompleted: PropTypes.func,
    getNextResults: PropTypes.func
  }

  constructor(props) {
    super(props);

    const { identify } = this.props;
    identify();
  }

  render() {
    const { app } = this.props;

    switch(app.appState) {
      case states.INIT:
      case states.LOBBY:
      case states.INTRO:
        return this.renderLobby();
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
    const { app, gameConsole, introCompleted } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GameLobby
            appState={app.appState}
            players={gameConsole.players}
            introCompleted={introCompleted}
          />
        </div>
      </div>
    );
  }

  renderQuestionAsk() {
    const { app, gameConsole, resetTimer, startTimer } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <QuestionComponent
            question={app.question}
            timer={gameConsole.timer}
            about={gameConsole.questionAbout}
            submittedAnswers={gameConsole.submittedAnswers}
            resetTimer={resetTimer}
            startTimer={startTimer}
          />
        </div>
      </div>
    );
  }

  renderQuestionGuess() {
    const { app, gameConsole, resetTimer, startTimer } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GuessesComponent
            question={app.question}
            answers={app.answers}
            submittedGuesses={gameConsole.submittedGuesses}
            timer={gameConsole.timer}
            resetTimer={resetTimer}
            startTimer={startTimer}
          />
        </div>
      </div>
    );
  }

  renderResults() {
    const { app, gameConsole, resetTimer, getNextResults } = this.props;

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <ResultsComponent
            appState={app.appState}
            question={app.question}
            guessResults={gameConsole.guessResults}
            points={gameConsole.points}
            resetTimer={resetTimer}
            getNextResults={getNextResults}
          />
        </div>
      </div>
    );
  }
}

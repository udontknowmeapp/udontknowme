import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import states from '../constants/stateConstants';
import GameLobby from '../components/game-console/GameLobby';
import QuestionComponent from '../components/game-console/QuestionComponent';
import GuessesComponent from '../components/game-console/GuessesComponent';
import ResultsComponent from '../components/game-console/ResultsComponent';
import GameOverComponent from '../components/game-console/GameOverComponent';
import {
  resetTimer,
  identify,
  introCompleted,
  getNextResults
} from '../actions/ConsoleActions';
import { startNewGame } from '../actions/AppActions';

export default class GameConsolePage extends Component {

  static propTypes = {
    // app props
    dispatch: PropTypes.func,
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
    })
  }

  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    dispatch(identify());
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
      case states.GAME_OVER:
        return this.renderGameOver();
        break;
    }
  }

  renderLobby() {
    const { app, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ introCompleted }, dispatch);

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GameLobby
            appState={app.appState}
            players={gameConsole.players}
            actions={actions}
          />
        </div>
      </div>
    );
  }

  renderQuestionAsk() {
    const { app, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ resetTimer, startTimer }, dispatch);

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <QuestionComponent
            question={app.question}
            timer={gameConsole.timer}
            about={gameConsole.questionAbout}
            submittedAnswers={gameConsole.submittedAnswers}
            actions={actions}
          />
        </div>
      </div>
    );
  }

  renderQuestionGuess() {
    const { app, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ resetTimer, startTimer }, dispatch);

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GuessesComponent
            question={app.question}
            answers={app.answers}
            submittedGuesses={gameConsole.submittedGuesses}
            timer={gameConsole.timer}
            actions={actions}
          />
        </div>
      </div>
    );
  }

  renderResults() {
    const { app, gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ resetTimer, getNextResults }, dispatch);

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <ResultsComponent
            appState={app.appState}
            question={app.question}
            guessResults={gameConsole.guessResults}
            points={gameConsole.points}
            actions={actions}
          />
        </div>
      </div>
    );
  }

  renderGameOver() {
    const { gameConsole, dispatch } = this.props;
    const actions = bindActionCreators({ startNewGame }, dispatch);

    return (
      <div className='game-console-page'>
        <div className='game-console-page-content'>
          <GameOverComponent
            points={gameConsole.points}
            actions={actions}
          />
        </div>
      </div>
    );
  }
}

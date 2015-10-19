import alt from '../alt';
import ConsoleActions from '../actions/ConsoleActions';

class GameConsoleStore {
  constructor() {
    this.bindActions(ConsoleActions);

    this.players = [];
    this.questionAbout = '';
    this.submittedAnswers = [];
    this.submittedGuesses = [];
    this.guessResults = [];
    this.points = [];
  }

  onSetPlayers(players) {
    this.players = players;
  }

  onSetQuestionInfo(payload) {
    // Reset Answers Queue
    this.submittedGuesses = [];
    this.guessResults = [];
    this.points = [];

    // Set question info
    const { about, answers } = payload;
    this.submittedAnswers = answers;
    this.questionAbout = about;
  }

  onSetGuesses(players) {
    this.submittedGuesses = players;
  }

  onAddGuessResults(answers) {
    this.guessResults = answers;
  }

  onAddPoints(points) {
    this.points = points;
  }

  onResetAndEnd() {
    this.players = [];
    this.questionAbout = '';
    this.submittedAnswers = [];
    this.submittedGuesses = [];
    this.guessResults = [];
    this.points = [];
  }
}

export default alt.createStore(GameConsoleStore, 'GameConsoleStore');

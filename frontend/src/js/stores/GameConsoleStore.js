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
    this.timer = 0;
    this.timerInterval = null;
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

  onSetComponentTimer(timer) {
    this.timer = timer;
    this.timerInterval = setInterval(() => this.decrementTimer(), 1000);
  }

  onResetTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timer = 0;
  }

  decrementTimer() {
    if (this.timer === 1) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.timer = 0;
    } else {
      this.timer--;
    }
  }

  onResetAndEnd() {
    this.players = [];
    this.questionAbout = '';
    this.submittedAnswers = [];
    this.submittedGuesses = [];
    this.guessResults = [];
    this.points = [];
    this.timer = 0;
    this.timerInterval = null;
  }
}

export default alt.createStore(GameConsoleStore, 'GameConsoleStore');

import indexOf from 'lodash/array/indexOf';
import alt from '../alt';
import PlayerActions from '../actions/PlayerActions';

class PlayerStore {
  constructor() {
    this.bindActions(PlayerActions);

    this.playerName = '';
    this.answerSubmitted = false;
    this.guessSubmitted = false;
    this.aboutMe = false;
  }

  onUpdatePlayerName(name) {
    this.playerName = name;
  }

  onSetQuestionInfo(payload) {
    const { about, answers } = payload;

    // Reset guesses for upcoming round
    this.guessSubmitted = false;

    // Set about me
    if (about === this.playerName) {
      this.aboutMe = true;
    } else {
      this.aboutMe = false;
    }

    // Set confirmation of submission
    if (indexOf(answers, this.playerName) > -1) {
      this.answerSubmitted = true;
    } else {
      this.answerSubmitted = false;
    }
  }

  onIsGuessSubmitted(guesses) {
    if (indexOf(guesses, this.playerName) > -1) {
      this.guessSubmitted = true;
    } else {
      this.guessSubmitted = false;
    }
  }

  onResetAndEnd() {
    this.playerName = '';
    this.answerSubmitted = false;
    this.guessSubmitted = false;
    this.aboutMe = false;
  }
}

export default alt.createStore(PlayerStore, 'PlayerStore');

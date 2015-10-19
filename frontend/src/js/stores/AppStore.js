import alt from '../alt';
import AppActions from '../actions/AppActions';
import states from '../constants/stateConstants';

class AppStore {
  constructor() {
    this.bindActions(AppActions);

    this.conn = null;
    this.appState = states.INIT;
    this.playerType = '';
    this.question = '';
    this.answers = [];
  }

  onConnection(conn) {
    this.conn = conn;
  }

  onSetAppState(state) {
    this.appState = state;
  }

  onSetPlayerType(playerType) {
    this.playerType = playerType;
  }

  onSetCurrentQuestion(question) {
    this.question = question;
  }

  onSetCurrentAnswers(answers) {
    this.answers = answers;
  }

  onResetAndEnd() {
    this.question = '';
    this.answers = [];
  }

  static checkCachedSession() {
    return localStorage.getItem('udkmSession');
  }
}

export default alt.createStore(AppStore, 'AppStore');

import alt from '../alt';
import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import AppActions from './AppActions';

class ConsoleActions {
  constructor() {
    this.generateActions(
      'setPlayers',
      'setQuestionInfo',
      'setGuesses',
      'addGuessResults',
      'addPoints',
      'resetAndEnd',
      'setComponentTimer',
      'resetTimer'
    );
  }

  identify(conn) {
    conn.send(playerTypes.CONSOLE, null, messages.IDENTIFY);
    AppActions.setPlayerType(playerTypes.CONSOLE);
  }

  introCompleted(conn) {
    conn.send(playerTypes.CONSOLE, null, messages.INTRO_COMPLETE);
  }
}

export default alt.createActions(ConsoleActions);

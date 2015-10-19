import alt from '../alt';
import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import AppActions from './AppActions';

class PlayerActions {
  constructor() {
    this.generateActions(
      'updatePlayerName',
      'setQuestionInfo',
      'isGuessSubmitted',
      'resetAndEnd'
    );
  }

  startGame(conn, name) {
    conn.send(playerTypes.PLAYER, name, messages.START);
  }

  setPlayerName(name, conn) {
    const { updatePlayerName } = this.actions;

    conn.send(playerTypes.PLAYER, name, messages.IDENTIFY);
    AppActions.setPlayerType(playerTypes.PLAYER);
    updatePlayerName(name);
  }

  submitAnswer(name, answer, conn) {
    conn.send(playerTypes.PLAYER, name, answer);
  }

  submitGuess(name, answerForGuess, conn) {
    conn.send(playerTypes.PLAYER, name, answerForGuess);
  }
}

export default alt.createActions(PlayerActions);

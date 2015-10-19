import alt from '../alt';
import ServerConnection from '../utils/ServerConnection';
import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import PlayerActions from './PlayerActions';
import ConsoleActions from './ConsoleActions';

class AppActions {
  constructor() {
    this.generateActions(
      'setAppState',
      'setPlayerType',
      'setCurrentQuestion',
      'setCurrentAnswers'
    );
  }

  connection(session) {
    const conn = new ServerConnection();

    if (session) {
      const { player_type, player_name } = session;
      const { setPlayerType } = this.actions;

      // Update player type in memory
      setPlayerType(player_type);
      if (player_type === playerTypes.PLAYER) {
        PlayerActions.updatePlayerName(player_name);
      }

      // Send identifying handshake
      conn.send(player_type, player_name, messages.IDENTIFY);
    }

    // Store connection in memory
    this.dispatch(conn);
  }

  updateQuestionInfo(question, about, answers) {
    const { setCurrentQuestion } = this.actions;
    setCurrentQuestion(question);
    ConsoleActions.setQuestionInfo({ about, answers });
    PlayerActions.setQuestionInfo({ about, answers });
  }

  updateGuessesInfo(answers, guesses) {
    const { setCurrentAnswers } = this.actions;
    setCurrentAnswers(answers);
    ConsoleActions.setGuesses(guesses);
    PlayerActions.isGuessSubmitted(guesses);
  }

  resetAndEnd() {
    ConsoleActions.resetAndEnd();
    PlayerActions.resetAndEnd();
    this.dispatch(true);
  }
}

export default alt.createActions(AppActions);

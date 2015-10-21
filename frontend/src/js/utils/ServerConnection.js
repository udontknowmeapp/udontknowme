import messages from '../constants/messagesConstants';
import states from '../constants/stateConstants';
import AppActions from '../actions/AppActions';
import ConsoleActions from '../actions/ConsoleActions';
import { getSocketUri } from './webSocketUtils';

export default class ServerConnection extends Object {

  constructor(uri) {
    super();

    this.socket = new WebSocket(getSocketUri());

    this.socket.onmessage = (payload) => {
      const messageData = JSON.parse(payload.data);
      const { state, data } = messageData;

      console.log(messageData);

      switch (state) {
        case states.LOBBY:
          this.handleLobbyState(data);
          break;
        case states.QUESTION_ASK:
          this.handleQuestionAskState(data);
          break;
        case states.QUESTION_GUESS:
          this.handleQuestionGuessState(data);
          break;
        case states.SHOW_RESULTS:
          this.handleShowResultsState(data);
          break;
        case states.SHOW_POINTS:
          this.handleShowPointsState(data);
          break;
      }

      if (data.hasOwnProperty('timer')) {
        const { timer } = data;
        ConsoleActions.setComponentTimer(timer);
      }

      AppActions.setAppState(state);
    }
  }

  send(player_type, player_name, message) {
    this.socket.send(JSON.stringify({
      player_type,
      player_name,
      message
    }));
  }

  handleLobbyState(data) {
    const { players, message } = data;

    if (message === messages.NEW_GAME) {
      AppActions.resetAndEnd();
    }

    ConsoleActions.setPlayers(players);
  }

  handleQuestionAskState(data) {
    const { about, question, submitted_answers } = data;
    AppActions.updateQuestionInfo(question, about, submitted_answers);
  }

  handleQuestionGuessState(data) {
    const { answers, submitted_guesses } = data;
    AppActions.updateGuessesInfo(answers, submitted_guesses);
  }

  handleShowResultsState(data) {
    const { answers } = data;
    console.log(answers);
    ConsoleActions.addGuessResults(answers);
  }

  handleShowPointsState(data) {
    const { points } = data;
    ConsoleActions.addPoints(points);
  }
}

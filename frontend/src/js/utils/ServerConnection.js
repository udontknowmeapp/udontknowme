import messages from '../constants/messagesConstants';
import states from '../constants/stateConstants';
import {
  setPlayers,
  addGuessResults,
  addPoints,
  setComponentTimer
} from '../actions/ConsoleActions';
import {
  setAppState,
  resetAndEnd,
  updateQuestionInfo,
  updateGuessesInfo
} from '../actions/AppActions';

export default class ServerConnection extends Object {

  constructor(uri, dispatch) {
    super();

    this.socket = new WebSocket(uri);
    this.dispatch = dispatch;

    this.socket.onmessage = (payload) => {
      const messageData = JSON.parse(payload.data);
      const { state, data } = messageData;

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

      if (data.timer != null && data.timer > 0) {
        this.dispatch(setComponentTimer(data.timer));
      }

      this.dispatch(setAppState(state));
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
      this.dispatch(resetAndEnd());
    }
    this.dispatch(setPlayers(players));
  }

  handleQuestionAskState(data) {
    const { about, question, submitted_answers } = data;
    this.dispatch(updateQuestionInfo(question, about, submitted_answers));
  }

  handleQuestionGuessState(data) {
    const { answers, submitted_guesses } = data;
    this.dispatch(updateGuessesInfo(answers, submitted_guesses));
  }

  handleShowResultsState(data) {
    this.dispatch(addGuessResults(data.answers));
  }

  handleShowPointsState(data) {
    this.dispatch(addPoints(data.points));
  }
}

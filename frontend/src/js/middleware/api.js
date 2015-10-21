import { getSocketUri } from '../utils/webSocketUtils';
import { rootActionTypes } from '../constants/actionConstants';
import messages from '../constants/messagesConstants';
import states from '../constants/stateConstants';
import {
  setPlayers,
  addGuessResults,
  addPoints,
  setComponentTimer
} from '../actions/consoleActions';
import {
  setAppState,
  resetAndEnd,
  updateQuestionInfo,
  updateGuessesInfo
} from '../actions/appActions';

function handleSocketConnection(socket) {
  socket.onmessage = (payload) => {
    const messageData = JSON.parse(payload.data);
    const { state, data } = messageData;

    console.log(messageData);

    switch(state) {
      case states.LOBBY:
        const { players, message } = data;
        if (message === messages.NEW_GAME) {
          resetAndEnd();
        }
        setPlayers(players);
        break;

      case states.QUESTION_ASK:
        const { about, question, submitted_answers } = data;
        updateQuestionInfo(question, about, submitted_answers);
        break;

      case states.QUESTION_GUESS:
        const { answers, submitted_guesses } = data;
        updateGuessesInfo(answers, submitted_guesses);
        break;

      case states.SHOW_RESULTS:
        addGuessResults(data.answers);
        break;

      case states.SHOW_POINTS:
        addPoints(data.points);
        break;

      default:
        break;
    }

    if (data.hasOwnProperty('timer')) {
      setComponentTimer(data.timer);
    }

    setAppState(state);
  }
}

export default store => next => action => {
  const { type } = action;
  let socket;

  if (type === rootActionTypes.CONNECTION) {
    socket = new WebSocket(getSocketUri());
    handleSocketConnection(socket);
  }

  // TODO - sending message stuffs
  if (type === rootActionTypes.SEND_MESSAGE) {
    const { player_type, player_name, message } = action;
    socket.send(JSON.stringify({
      player_type,
      player_name,
      message
    }));
  }

  return next(action);
}

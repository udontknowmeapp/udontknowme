import messages from '../constants/messagesConstants';
import { rootActionTypes as types } from '../constants/actionConstants';
import * as PlayerActions from './playerActions';
import * as ConsoleActions from './consoleActions';

export function connection(dispatch) {
  return {
    type: types.CONNECTION,
    conn: {},
    dispatch
  };
}

export function sendMessage(player_type, player_name, message) {
  return (dispatch, getState) => {
    const { app } = getState();
    return dispatch({
      type: types.SEND_MESSAGE,
      conn: app.conn,
      player_type,
      player_name,
      message
    });
  };
}

export function setAppState(appState) {
  return {
    type: types.SET_APP_STATE,
    appState
  };
}

export function setPlayerType(playerType) {
  return {
    type: types.SET_PLAYER_TYPE,
    playerType
  };
}

export function setCurrentQuestion(question) {
  return {
    type: types.SET_CURRENT_QUESTION,
    question
  };
}

export function setCurrentAnswers(answers) {
  return {
    type: types.SET_CURRENT_ANSWERS,
    answers
  };
}

export function updateQuestionInfo(question, about, answers) {
  return [
    ConsoleActions.setQuestionInfo(about, answers),
    PlayerActions.setQuestionInfo(about, answers),
    setCurrentQuestion(question)
  ];
}

export function updateGuessesInfo(answers, guesses) {
  return [
    ConsoleActions.setGuesses(guesses),
    PlayerActions.isGuessSubmitted(guesses),
    setCurrentAnswers(answers)
  ];
}

export function resetAndEnd() {
  return { type: types.RESET_AND_END };
}

export function startNewGame() {
  return (dispatch, getState) => {
    const { app, player } = getState();
    return dispatch(sendMessage(
      app.playerType,
      player.playerName.length ? player.playerName : null,
      messages.NEW_GAME
    ));
  };
}

import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import { types as types } from '../constants/actionConstants';
import * as PlayerActions from './playerActions';
import * as ConsoleActions from './consoleActions';

export function connection() {
  return {
    type: types.CONNECTION,
    conn: true
  };
}

export function sendMessage(player_type, player_name, message) {
  return {
    type: types.SEND_MESSAGE,
    player_type,
    player_name,
    message
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
  const { app } = getState();
  if (app.playerType === playerTypes.CONSOLE) {
    ConsoleActions.setQuestionInfo(about, answers);
  } else if (app.playerType === playerTypes.PLAYER) {
    PlayerActions.setQuestionInfo(about, answers);
  }

  return dispatch(setCurrentQuestion(question));
}

export function updateGuessesInfo(answers, guesses) {
  const { app } = getState();
  if (app.playerType === playerTypes.CONSOLE) {
    ConsoleActions.setGuesses(guesses);
  } else if (app.playerType === playerTypes.PLAYER) {
    PlayerActions.isGuessSubmitted(guesses);
  }

  return dispatch(setCurrentAnswers(answers));
}

export function resetAndEnd() {
  return { type: types.RESET_AND_END };
}

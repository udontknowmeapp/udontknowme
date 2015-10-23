import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import { playerActionTypes as types } from '../constants/actionConstants';
import { sendMessage, setPlayerType } from './appActions';

export function updatePlayerName(playerName) {
  return {
    type: types.UPDATE_PLAYER_NAME,
    playerName
  };
}

export function setQuestionInfo(about, answers) {
  return {
    type: types.SET_QUESTION_INFO,
    about,
    answers
  };
}

export function isGuessSubmitted(guesses) {
  return {
    type: types.IS_GUESS_SUBMITTED,
    guesses
  };
}

export function startGame() {
  return (dispatch, getState) => {
    const { player } = getState();
    return dispatch(
      sendMessage(playerTypes.PLAYER, player.playerName, messages.START)
    );
  };
}

export function setPlayerName(name) {
  return [
    setPlayerType(playerTypes.PLAYER),
    updatePlayerName(name),
    sendMessage(playerTypes.PLAYER, name, messages.IDENTIFY)
  ];
}

export function submitAnswer(answer) {
  return (dispatch, getState) => {
    const { player } = getState();
    return dispatch(
      sendMessage(playerTypes.PLAYER, player.playerName, answer)
    );
  };
}

export function submitGuess(answerForGuess) {
  return (dispatch, getState) => {
    const { player } = getState();
    return dispatch(
      sendMessage(playerTypes.PLAYER, player.playerName, answerForGuess)
    );
  };
}

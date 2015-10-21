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
  const { player } = getState();
  sendMessage(playerTypes.PLAYER, player.playerName, messages.START);
}

export function setPlayerName(name) {
  sendMessage(playerTypes.PLAYER, name, messages.IDENTIFY);
  setPlayerType(playerTypes.PLAYER);
  return dispatch(updatePlayerName(name));
}

export function submitAnswer(answer) {
  const { player } = getState();
  sendMessage(playerTypes.PLAYER, player.playerName, answer);
}

export function submitGuess(answerForGuess) {
  const { player } = getState();
  sendMessage(playerTypes.PLAYER, player.playerName, answerForGuess);
}

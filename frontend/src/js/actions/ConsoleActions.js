import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';
import states from '../../constants/stateConstants';
import { consoleActionTypes as types } from '../constants/actionConstants';
import { sendMessage, setPlayerType } from './appActions';

export function setPlayers(players) {
  return {
    type: types.SET_PLAYERS,
    players
  };
}

export function setQuestionInfo(answers, about) {
  return {
    type: types.SET_QUESTION_INFO,
    answers,
    about
  };
}

export function setGuesses(submittedGuesses) {
  return {
    type: types.SET_GUESSES,
    submittedGuesses
  };
}

export function addGuessResults(guessResults) {
  return {
    type: types.ADD_GUESS_RESULTS,
    guessResults
  };
}

export function addPoints(points) {
  return {
    type: types.ADD_POINTS,
    points
  };
}

export function setComponentTimer(timer) {
  let timerInterval = setInterval(() => decrementTimer(), 1000);
  return {
    type: types.SET_COMPONENT_TIMER,
    timer,
    timerInterval
  };
}

export function decrementTimer() {
  return { type: types.DECREMENT_TIMER };
}

export function resetTimer() {
  return { type: types.RESET_TIMER };
}

export function startTimer() {
  sendMessage(playerTypes.CONSOLE, null, messages.START_TIMER);
}

export function identify() {
  sendMessage(playerTypes.CONSOLE, null, messages.IDENTIFY);
  return dispatch(setPlayerType(playerTypes.CONSOLE));
}

export function introCompleted() {
  sendMessage(playerTypes.CONSOLE, null, messages.INTRO_COMPLETE);
}

export function getNextResults() {
  const { app } = getState();
  sendMessage(
    playerTypes.CONSOLE,
    null,
    app.appState === states.SHOW_RESULTS ? messages.RESULTS_COMPLETE : messages.POINTS_COMPLETE
  );
}

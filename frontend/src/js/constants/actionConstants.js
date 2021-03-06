// root action constants
export const rootActionTypes = {
  CONNECTION: 'CONNECTION',
  SEND_MESSAGE: 'SEND_MESSAGE',
  SET_APP_STATE: 'SET_APP_STATE',
  SET_PLAYER_TYPE: 'SET_PLAYER_TYPE',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_CURRENT_ANSWERS: 'SET_CURRENT_ANSWERS',
  RESET_AND_END: 'RESET_AND_END'
};

// player action constants
export const playerActionTypes = {
  UPDATE_PLAYER_NAME: 'UPDATE_PLAYER_NAME',
  SET_QUESTION_INFO: 'SET_QUESTION_INFO',
  IS_GUESS_SUBMITTED: 'IS_GUESS_SUBMITTED',
  RESET_AND_END: 'RESET_AND_END'
};

// console action constants
export const consoleActionTypes = {
  SET_PLAYERS: 'SET_PLAYERS',
  SET_QUESTION_INFO: 'SET_QUESTION_INFO',
  SET_GUESSES: 'SET_GUESSES',
  ADD_GUESS_RESULTS: 'ADD_GUESS_RESULTS',
  ADD_POINTS: 'ADD_POINTS',
  SET_COMPONENT_TIMER: 'SET_COMPONENT_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  DECREMENT_TIMER: 'DECREMENT_TIMER',
  RESET_AND_END: 'RESET_AND_END'
};

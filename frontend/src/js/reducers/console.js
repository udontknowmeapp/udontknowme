import merge from 'lodash/object/merge';
import {
  rootActionTypes,
  consoleActionTypes as types
} from '../constants/actionConstants';

const initialState = {
  players: [],
  questionAbout: '',
  submittedAnswers: [],
  submittedGuesses: [],
  guessResults: [],
  points: [],
  timer: 0,
  timerInterval: null
};

export default function root(state = initialState, action) {
  switch(action.type) {
    case types.SET_PLAYERS:
      return Object.assign({}, state, { players: action.players });

    case types.SET_QUESTION_INFO:
      return Object.assign({}, state, {
        submittedGuesses: [],
        guessResults: [],
        points: [],
        submittedAnswers: action.answers,
        questionAbout: action.about
      });

    case types.SET_GUESSES:
      return merge({}, state, {
        submittedGuesses: action.submittedGuesses
      });

    case types.ADD_GUESS_RESULTS:
      return merge({}, state, { guessResults: action.guessResults });

    case types.ADD_POINTS:
      return merge({}, state, { points: action.points });

    case types.SET_COMPONENT_TIMER:
      return merge({}, state, {
        timer: action.timer,
        timerInterval:
        action.timerInterval
      });

    case types.RESET_TIMER:
      if (state.timerInterval) {
        clearInterval(state.timerInterval)
      }

      return merge({}, state, {
        timerInterval: null,
        timer: 0
      });

    case types.DECREMENT_TIMER:
      if (state.timer === 1) {
        clearInterval(state.timerInterval);
        return merge({}, state, {
          timerInterval: null,
          timer: 0
        });
      } else {
        return merge({}, state, {
          timer: state.timer--
        });
      }

    case rootActionTypes.RESET_AND_END:
      return initialState;

    default:
      return state;
  }
}

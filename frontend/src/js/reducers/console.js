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

// TODO - Timer interval set in actions b/c calls other

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
      const { timer, timerInterval } = action;
      return merge({}, state, { timer, timerInterval });

    case types.RESET_TIMER:
      const { timerInterval } = state;
      if (timerInterval) {
        clearInterval(timerInterval)
      }

      return merge({}, state, {
        timerInterval: null,
        timer: 0
      });

    case types.DECREMENT_TIMER:
      const { timer, timerInterval } = state;
      if (timer === 1) {
        clearInterval(timerInterval);
        return merge({}, state, {
          timerInterval: null,
          timer: 0
        });
      } else {
        return merge({}, state, {
          timer: timer--
        });
      }

    case rootActionTypes.RESET_AND_END:
      return initialState;

    default:
      return state;
  }
}

import merge from 'lodash/object/merge';
import {
  SET_PLAYERS,
  SET_QUESTION_INFO,
  SET_GUESSES,
  ADD_GUESS_RESULTS,
  ADD_POINTS,
  SET_COMPONENT_TIMER,
  RESET_TIMER,
  DECREMENT_TIMER,
  RESET_AND_END
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
    case SET_PLAYERS:
      return Object.assign({}, state, { players: action.players });

    case SET_QUESTION_INFO:
      return Object.assign({}, state, {
        submittedGuesses: [],
        guessResults: [],
        points: [],
        submittedAnswers: action.answers,
        questionAbout: action.about
      });

    case SET_GUESSES:
      return merge({}, state, {
        submittedGuesses: action.submittedGuesses
      });

    case ADD_GUESS_RESULTS:
      return merge({}, state, { guessResults: action.guessResults });

    case ADD_POINTS:
      return merge({}, state, { points: action.points });

    case SET_COMPONENT_TIMER:
      const { timer, timerInterval } = action;
      return merge({}, state, { timer, timerInterval });

    case RESET_TIMER:
      const { timerInterval } = state;
      if (timerInterval) {
        clearInterval(timerInterval)
      }

      return merge({}, state, {
        timerInterval: null,
        timer: 0
      });

    case DECREMENT_TIMER:
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

    case RESET_AND_END:
      return initialState;

    default:
      return state;
  }
}

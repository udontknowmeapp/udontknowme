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
  timer: 0
};

export default function player(state = initialState, action) {
  switch(action.type) {
    case types.SET_PLAYERS:
      return merge({}, state, { players: action.players });

    case types.SET_QUESTION_INFO:
      const { about, answers } = action;

      // On new question, reset console info before adding new info
      if (state.questionAbout === about) {
        return merge({}, initialState, {
          players: state.players,
          submittedAnswers: answers,
          questionAbout: about,
        });
      } else {
        return merge({}, state, {
          submittedAnswers: answers,
          questionAbout: about
        });
      }

    case types.SET_GUESSES:
      return merge({}, state, {
        submittedGuesses: action.submittedGuesses
      });

    case types.ADD_GUESS_RESULTS:
      return merge({}, state, { guessResults: action.guessResults });

    case types.ADD_POINTS:
      return merge({}, state, { points: action.points });

    case types.SET_COMPONENT_TIMER:
      if (state.timer === 0) {
        return merge({}, state, { timer: action.timer });
      }

    case types.RESET_TIMER:
      return merge({}, state, { timer: 0 });

    case types.DECREMENT_TIMER:
      if (state.timer > 0) {
        return merge({}, state, {
          timer: (state.timer - 1)
        });
      }

    case rootActionTypes.RESET_AND_END:
      return initialState;

    default:
      return state;
  }
}

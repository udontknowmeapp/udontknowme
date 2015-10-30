import merge from 'lodash/object/merge';
import indexOf from 'lodash/array/indexOf';
import {
  rootActionTypes,
  playerActionTypes as types
} from '../constants/actionConstants';

const initialState = {
  playerName: '',
  answerSubmitted: false,
  guessSubmitted: false,
  aboutMe: false
};

export default function player(state = initialState, action) {
  switch(action.type) {
    case types.UPDATE_PLAYER_NAME:
      return merge({}, state, { playerName: action.playerName });

    case types.SET_QUESTION_INFO:
      const { playerName } = state;
      const { about, answers } = action;

      return merge({}, state, {
        guessSubmitted: false,
        aboutMe: playerName === about ? true : false,
        answerSubmitted: indexOf(answers, playerName) > -1 ? true : false
      });

    case types.IS_GUESS_SUBMITTED:
      return merge({}, state, {
        guessSubmitted: indexOf(action.guesses, state.playerName) > -1 ? true : false
      });

    case rootActionTypes.RESET_AND_END:
      return initialState;

    default:
      return state;
  }
}

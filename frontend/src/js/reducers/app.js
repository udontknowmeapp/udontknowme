import merge from 'lodash/object/merge';
import states from '../constants/stateConstants';
import { rootActionTypes as types } from '../constants/actionConstants';

const initialState = {
  conn: false,
  appState: states.INIT,
  playerType: '',
  question: '',
  answers: []
};

export default function app(state = initialState, action) {
  switch(action.type) {
    case types.CONNECTION:
      return merge({}, state, { conn: action.conn });

    case types.SET_APP_STATE:
      return merge({}, state, { appState: action.appState });

    case types.SET_PLAYER_TYPE:
      return merge({}, state, { playerType: action.playerType });

    case types.SET_CURRENT_QUESTION:
      return merge({}, state, { question: action.question });

    case types.SET_CURRENT_ANSWERS:
      return merge({}, state, { answers: action.answers });

    case types.RESET_AND_END:
      return merge({}, state, {
        question: '',
        answers: []
      });

    default:
      return state;
  }
}

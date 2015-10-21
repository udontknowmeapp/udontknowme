import merge from 'lodash/object/merge';
import states from '../constants/stateConstants';
import {
  CONNECTION,
  SET_APP_STATE,
  SET_PLAYER_TYPE,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWERS,
  RESET_AND_END
} from '../constants/actionConstants';

const initialState = {
  conn: null,
  appState: states.INIT,
  playerType: '',
  question: '',
  answers: []
};

export default function root(state = initialState, action) {
  switch(action.type) {
    case CONNECTION:
      return merge({}, state, { conn: action.conn });

    case SET_APP_STATE:
      return merge({}, state, { appState: action.appState });

    case SET_PLAYER_TYPE:
      return merge({}, state, { playerType: action.playerType });

    case SET_CURRENT_QUESTION:
      return merge({}, state, { question: action.question });

    case SET_CURRENT_ANSWERS:
      return merge({}, state, { answers: action.answers });

    case RESET_AND_END:
      return merge({}, state, {
        question: '',
        answers: []
      });

    default:
      return state;
  }
}

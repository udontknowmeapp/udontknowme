import expect from 'expect';
import merge from 'lodash/object/merge'
import app from '../../reducers/app';
import playerTypes from '../../constants/playerTypeConstants';
import { rootActionTypes as types } from '../../constants/actionConstants';
import states from '../../constants/stateConstants';

const initialState = {
  conn: {},
  appState: states.INIT,
  playerType: '',
  question: '',
  answers: []
}

describe('reducers/app', () => {
  it('should handle the initial state', () => {
    expect(
      app(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle CONNECTION', () => {
    expect(
      app(undefined, {
        type: types.CONNECTION,
        conn: { hello: 'world!' }
      })
    ).toEqual(merge({}, initialState, {
      conn: { hello: 'world!'}
    }));
  });

  it('should handle SET_APP_STATE', () => {
    expect(
      app(undefined, {
        type: types.SET_APP_STATE,
        appState: states.QUESTION_ASK
      })
    ).toEqual(merge({}, initialState, { appState: states.QUESTION_ASK }));
  });

  it('should handle SET_PLAYER_TYPE', () => {
    expect(
      app(undefined, {
        type: types.SET_PLAYER_TYPE,
        playerType: playerTypes.PLAYER
      })
    ).toEqual(merge({}, initialState, { playerType: playerTypes.PLAYER }));
  });

  it('should handle SET_CURRENT_QUESTION', () => {
    expect(
      app(undefined, {
        type: types.SET_CURRENT_QUESTION,
        question: 'To be or not to be?'
      })
    ).toEqual(merge({}, initialState, { question: 'To be or not to be?' }));
  });

  it('should handle SET_CURRENT_ANSWERS', () => {
    expect(
      app(undefined, {
        type: types.SET_CURRENT_ANSWERS,
        answers: ['One', 'Two', 'Three']
      })
    ).toEqual(merge({}, initialState, { answers: ['One', 'Two', 'Three'] }));
  });

  it('RESET_AND_END should reset question and answers values', () => {
    const prevState = {
      conn: {},
      appState: states.LOBBY,
      playerType: playerTypes.PLAYER,
      question: 'To be or not to be?',
      answers: ['Yes', 'No', 'Maybe']
    };

    expect(app(prevState, { type: types.RESET_AND_END }))
      .toEqual(merge({}, prevState, {
        question: '',
        answers: []
      }));
  });
})

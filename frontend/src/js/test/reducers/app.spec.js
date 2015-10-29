import expect from 'expect';
import app from '../../reducers/app';
import { rootActionTypes as types } from '../../constants/actionConstants';
import states from '../../constants/stateConstants';

describe('reducers/app', () => {
  it('should handle the initial state', () => {
    expect(
      app(undefined, {})
    ).toEqual({
      conn: {},
      appState: states.INIT,
      playerType: '',
      question: '',
      answers: []
    });
  });

  it('should handle CONNECTION', () => {
    expect(
      app(undefined, {
        type: types.CONNECTION,
        conn: { hello: 'world!' }
      })
    ).toEqual({
      conn: { hello: 'world!'},
      appState: states.INIT,
      playerType: '',
      question: '',
      answers: []
    });
  });
})

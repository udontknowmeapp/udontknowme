import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import * as ConsoleActions from '../../actions/ConsoleActions';
import playerTypes from '../../constants/playerTypeConstants';
import messages from '../../constants/messagesConstants';
import states from '../../constants/stateConstants';
import {
  rootActionTypes,
  consoleActionTypes as types
} from '../../constants/actionConstants';

const middlewares = [thunk, multi];

// Create a mock store for actions that deal w/ state data
function mockStore(getState, expectedActions, onLastAction) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }
  if (typeof onLastAction !== 'undefined' && typeof onLastAction !== 'function') {
    throw new Error('onLastAction should either be undefined or function.');
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === 'function' ?
          getState() :
          getState;
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift();
        expect(action).toEqual(expectedAction);
        if (onLastAction && !expectedActions.length) {
          onLastAction();
        }
        return action;
      }
    };
  }

  const mockStoreWithMiddleware = applyMiddleware(
    ...middlewares
  )(mockStoreWithoutMiddleware);

  return mockStoreWithMiddleware();
}

describe('actions/ConsoleActions', () => {
  it('setPlayers should create a SET_PLAYERS action', () => {
    const players = ['dollabill$', 'messy J'];
    expect(ConsoleActions.setPlayers(players)).toEqual({
      type: types.SET_PLAYERS,
      players
    });
  });

  it('setQuestionInfo should create a SET_QUESTION_INFO action', () => {
    const about = 'messy J';
    const answers = ['Yes', 'No', 'Maybe'];
    expect(ConsoleActions.setQuestionInfo(about, answers)).toEqual({
      type: types.SET_QUESTION_INFO,
      about,
      answers
    });
  });

  it('setGuesses should create a SET_GUESSES action', () => {
    const submittedGuesses = ['Yes', 'No', 'Maybe'];
    expect(ConsoleActions.setGuesses(submittedGuesses)).toEqual({
      type: types.SET_GUESSES,
      submittedGuesses
    });
  });

  it('addGuessResults should create an ADD_GUESS_RESULTS action', () => {
    const guessResults = ['Yes', 'No', 'Maybe'];
    expect(ConsoleActions.addGuessResults(guessResults)).toEqual({
      type: types.ADD_GUESS_RESULTS,
      guessResults
    });
  });

  it('addPoints should create an ADD_POINTS action', () => {
    const points = [1,2,3];
    expect(ConsoleActions.addPoints(points)).toEqual({
      type: types.ADD_POINTS,
      points
    });
  });

  it('decrementTimer should create a SET_COMPONENT_TIMER action', () => {
    expect(ConsoleActions.setComponentTimer(60)).toEqual({
      type: types.SET_COMPONENT_TIMER,
      timer: 60
    });
  });

  it('decrementTimer should create a DECREMENT_TIMER action', () => {
    expect(ConsoleActions.decrementTimer()).toEqual({
      type: types.DECREMENT_TIMER
    });
  });

  it('resetTimer should create a RESET_TIMER action', () => {
    expect(ConsoleActions.resetTimer()).toEqual({
      type: types.RESET_TIMER
    });
  });

  it('identify should create app.SET_PLAYER_TYPE and app.SEND_MESSAGE actions', (done) => {
    const mockState = { app: { conn: 'CONN' }};
    const player_type = playerTypes.CONSOLE;
    const player_name = null;
    const message = messages.IDENTIFY;

    const expectedActions = [
      {
        type: rootActionTypes.SET_PLAYER_TYPE,
        playerType: player_type
      },
      {
        type: rootActionTypes.SEND_MESSAGE,
        conn: mockState.app.conn,
        player_type,
        player_name,
        message
      }
    ];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(ConsoleActions.identify());
  });

  it('introCompleted should create an app.INTRO_COMPLETE action', (done) => {
    const mockState = { app: { conn: 'CONN' }};
    const player_type = playerTypes.CONSOLE;
    const player_name = null;
    const message = messages.INTRO_COMPLETE;

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(ConsoleActions.introCompleted());
  });

  it('getNextResults should create an app.SEND_MESSAGE action w/ messages.RESULTS_COMPLETE if app.appState === states.SHOW_RESULTS', (done) => {
    const mockState = { app: {
      conn: 'CONN',
      appState: states.SHOW_RESULTS
    }};
    const player_type = playerTypes.CONSOLE;
    const player_name = null;
    const message = messages.RESULTS_COMPLETE;

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(ConsoleActions.getNextResults());
  });

  it('getNextResults should create an app.SEND_MESSAGE action w/ messages.POINTS_COMPLETE if app.appState !== states.SHOW_RESULTS', (done) => {
    const mockState = { app: {
      conn: 'CONN',
      appState: states.INIT
    }};
    const player_type = playerTypes.CONSOLE;
    const player_name = null;
    const message = messages.POINTS_COMPLETE;

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(ConsoleActions.getNextResults());
  });
});

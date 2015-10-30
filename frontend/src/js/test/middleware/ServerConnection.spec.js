import merge from 'lodash/object/merge';
import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import * as AppActions from '../../actions/AppActions';
import * as ConsoleActions from '../../actions/ConsoleActions';
import states from '../../constants/stateConstants';
import messages from '../../constants/messagesConstants';
import ServerConnection from '../../utils/ServerConnection';
import {
  rootActionTypes,
  consoleActionTypes,
  playerActionTypes
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

class MockServer extends Object {
  constructor(mockSocket) {
    super();
    this.socket = mockSocket;
  }

  sendMessage(state, timer=null, message=null, other=null) {
    const messageFromServer = {
      state,
      data: merge({}, { timer, message }, other)
    };
    this.socket.socket.onData(messageFromServer);
  }
}

class MockSocket extends Object {
  onData(payload) {
    this.onmessage({ data: JSON.stringify(payload) });
  }
}

const mockUri = 'ws://localhost:8080/';

describe('middleware/api + utils/ServerConnection', () => {
  /** TODO
    *  - data.timer != null && data.timer > 0
    */
  beforeEach(() => global.WebSocket = MockSocket);

  it('creates a app.SET_APP_STATE action on each new message', done => {
    const appState = 'TEST';
    const expectedActions = [{
      type: rootActionTypes.SET_APP_STATE,
      appState
    }];
    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState);
  });

  it('creates a console.SET_PLAYERS action on states.LOBBY', done => {
    const appState = states.LOBBY;
    const players = ['dollabill$', 'messy J'];
    const expectedActions = [
      {
        type: consoleActionTypes.SET_PLAYERS,
        players
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, null, { players });
  });

  it('creates a app.RESET_AND_END action on states.LOBBY w/ messages.NEW_GAME', done => {
    const appState = states.LOBBY;
    const players = ['dollabill$'];
    const message = messages.NEW_GAME;
    const expectedActions = [
      {
        type: rootActionTypes.RESET_AND_END
      },
      {
        type: consoleActionTypes.SET_PLAYERS,
        players
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, message, { players });
  });

  it('should create console.SET_QUESTION_INFO, player.SET_QUESTION_INFO, and app.SET_CURRENT_QUESTION on states.QUESTION_ASK', done => {
    const appState = states.QUESTION_ASK;
    const question = 'To be or not to be?';
    const about = 'dollabill$';
    const answers = ['Yes', 'No', 'Maybe'];
    const expectedActions = [
      {
        type: consoleActionTypes.SET_QUESTION_INFO,
        answers,
        about
      },
      {
        type: playerActionTypes.SET_QUESTION_INFO,
        about,
        answers
      },
      {
        type: rootActionTypes.SET_CURRENT_QUESTION,
        question
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, null, {
      about,
      question,
      submitted_answers: answers
    });
  });

  it('should create console.SET_GUESSES, player.IS_GUESS_SUBMITTED, and app.SET_CURRENT_ANSWERS on states.QUESTION_GUESS', done => {
    const appState = states.QUESTION_GUESS;
    const answers = ['Yes', 'No', 'Maybe'];
    const guesses = ['Heh', 'Lolol'];
    const expectedActions = [
      {
        type: consoleActionTypes.SET_GUESSES,
        submittedGuesses: guesses
      },
      {
        type: playerActionTypes.IS_GUESS_SUBMITTED,
        guesses
      },
      {
        type: rootActionTypes.SET_CURRENT_ANSWERS,
        answers
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, null, {
      answers,
      submitted_guesses: guesses
    });
  });

  it('creates a console.ADD_GUESS_RESULTS action on states.SHOW_RESULTS', done => {
    const appState = states.SHOW_RESULTS;
    const answers = ['dollabill$', 'messy J'];
    const expectedActions = [
      {
        type: consoleActionTypes.ADD_GUESS_RESULTS,
        guessResults: answers
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, null, { answers });
  });

  it('creates a console.ADD_POINTS action on states.SHOW_POINTS', done => {
    const appState = states.SHOW_POINTS;
    const points = ['dollabill$', 'messy J'];
    const expectedActions = [
      {
        type: consoleActionTypes.ADD_POINTS,
        points
      },
      {
        type: rootActionTypes.SET_APP_STATE,
        appState
      }
    ];

    const store = mockStore({}, expectedActions, done);
    const conn = new ServerConnection(mockUri, store.dispatch);
    const mockServer = new MockServer(conn);
    mockServer.sendMessage(appState, null, null, { points });
  });
});

import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import * as AppActions from '../../actions/AppActions';
import playerTypes from '../../constants/playerTypeConstants';
import messages from '../../constants/messagesConstants';
import states from '../../constants/stateConstants';
import {
  playerActionTypes,
  consoleActionTypes,
  rootActionTypes as types
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

describe('actions/AppActions', () => {
  it('connection should create a CONNECTION action', () => {
    expect(AppActions.connection({})).toEqual({
      type: types.CONNECTION,
      conn: {},
      dispatch: {}
    });
  });

  it('sendMessage should create a SEND_MESSAGE action', done => {
    const mockState = { app: { conn: 'CONN' }};
    const player_type = playerTypes.PLAYER;
    const player_name = 'dollabill$';
    const message = messages.IDENTIFY;

    const expectedActions = [{
      type: types.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];
    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(AppActions.sendMessage(player_type, player_name, message));
  });

  it('setAppState should create a SET_APP_STATE action', () => {
    expect(AppActions.setAppState(states.INIT)).toEqual({
      type: types.SET_APP_STATE,
      appState: states.INIT
    });
  });

  it('setPlayerType should create at SET_PLAYER_TYPE action', () => {
    const playerType = playerTypes.PLAYER;
    expect(AppActions.setPlayerType(playerType)).toEqual({
      type: types.SET_PLAYER_TYPE,
      playerType
    });
  });

  it('setCurrentQuestion should create a SET_CURRENT_QUESTION action', () => {
    const question = 'To be or not to be?';
    expect(AppActions.setCurrentQuestion(question)).toEqual({
      type: types.SET_CURRENT_QUESTION,
      question
    });
  });

  it('setCurrentAnswers should create a SET_CURRENT_ANSWERS action', () => {
    const answers = ['Yes', 'No', 'Maybe'];
    expect(AppActions.setCurrentAnswers(answers)).toEqual({
      type: types.SET_CURRENT_ANSWERS,
      answers
    });
  });

  it('updateQuestionInfo should create console.SET_QUESTION_INFO, player.SET_QUESTION_INFO, and SET_CURRENT_QUESTION', (done) => {
    const mockState = {};
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
        type: types.SET_CURRENT_QUESTION,
        question
      }
    ];
    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(AppActions.updateQuestionInfo(question, about, answers));
  });

  it('updateGuessesInfo should create console.SET_GUESSES, player.IS_GUESS_SUBMITTED, and SET_CURRENT_ANSWERS', (done) => {
    const mockState = {};
    const answers = ['Yes', 'No', 'Maybe'];
    const guesses = ['Neigh', 'Neigh', 'Neigh'];

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
        type: types.SET_CURRENT_ANSWERS,
        answers
      }
    ];
    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(AppActions.updateGuessesInfo(answers, guesses));
  });

  it('resetAndEnd should create a RESET_AND_END action', () => {
    expect(AppActions.resetAndEnd()).toEqual({ type: types.RESET_AND_END });
  });

  it('startNewGame should call SEND_MESSAGE', (done) => {
    const mockState = {
      player: { playerName: 'dollabill$' },
      app: {
        playerType: playerTypes.PLAYER,
        conn: 'CONN'
      }
    };
    const message = messages.NEW_GAME;
    const expectedActions = [{
      type: types.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type: mockState.app.playerType,
      player_name: mockState.player.playerName,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(AppActions.startNewGame());
  })
});

import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import * as PlayerActions from '../../actions/PlayerActions';
import playerTypes from '../../constants/playerTypeConstants';
import messages from '../../constants/messagesConstants';
import {
  rootActionTypes,
  playerActionTypes as types
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

describe('actions/PlayerActions', () => {
  it('updatePlayerName should create a UPDATE_PLAYER_NAME action', () => {
    const playerName = 'dollabill$';
    expect(PlayerActions.updatePlayerName(playerName)).toEqual({
      type: types.UPDATE_PLAYER_NAME,
      playerName
    });
  });

  it('setQuestionInfo should create a SET_QUESTION_INFO action', () => {
    const about = 'dollabill$';
    const answers = ['Yes', 'No', 'Maybe'];
    expect(PlayerActions.setQuestionInfo(about, answers)).toEqual({
      type: types.SET_QUESTION_INFO,
      about,
      answers
    });
  });

  it('isGuessSubmitted should create a IS_GUESS_SUBMITTED action', () => {
    const guesses = ['Yes', 'No', 'Maybe'];
    expect(PlayerActions.isGuessSubmitted(guesses)).toEqual({
      type: types.IS_GUESS_SUBMITTED,
      guesses
    });
  });

  it('startGame should create an app.SEND_MESSAGE action', (done) => {
    const mockState = {
      app: { conn: 'CONN' },
      player: { playerName: 'dollabill$' }
    };
    const player_type = playerTypes.PLAYER;
    const player_name = mockState.player.playerName;
    const message = messages.START;

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(PlayerActions.startGame());
  });

  it('setPlayerName should create app.SET_PLAYER_TYPE, UPDATE_PLAYER_NAME, and app.SEND_MESSAGE actions', (done) => {
    const mockState = { app: { conn: 'CONN' }};
    const player_type = playerTypes.PLAYER;
    const player_name = 'dollabill$';
    const message = messages.IDENTIFY;

    const expectedActions = [
      {
        type: rootActionTypes.SET_PLAYER_TYPE,
        playerType: player_type
      },
      {
        type: types.UPDATE_PLAYER_NAME,
        playerName: player_name
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
    store.dispatch(PlayerActions.setPlayerName(player_name));
  });

  it('submitAnswer should create an app.SEND_MESSAGE action', (done) => {
    const mockState = {
      app: { conn: 'CONN' },
      player: { playerName: 'dollabill$' }
    };
    const player_type = playerTypes.PLAYER;
    const player_name = mockState.player.playerName;
    const message = 'My answer';

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(PlayerActions.submitAnswer(message));
  });

  it('submitGuess should create an app.SEND_MESSAGE action', (done) => {
    const mockState = {
      app: { conn: 'CONN' },
      player: { playerName: 'dollabill$' }
    };
    const player_type = playerTypes.PLAYER;
    const player_name = mockState.player.playerName;
    const message = 'My answer';

    const expectedActions = [{
      type: rootActionTypes.SEND_MESSAGE,
      conn: mockState.app.conn,
      player_type,
      player_name,
      message
    }];

    const store = mockStore(mockState, expectedActions, done);
    store.dispatch(PlayerActions.submitGuess(message));
  });
});

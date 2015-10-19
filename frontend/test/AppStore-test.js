jest.dontMock('../src/js/stores/AppStore');

import ServerConnection from '../src/js/utils/ServerConnection';
import AppActions from '../src/js/actions/AppActions';
import states from '../src/js/constants/stateConstants';
import playerTypes from '../src/js/constants/playerTypeConstants';

describe('AppStore', () => {

  let alt;
  let callback;
  let AppStore;

  beforeEach(() => {
    alt = require('../src/js/alt');
    alt.dispatcher = { register: jest.genMockFunction() };
    AppStore = require('../src/js/stores/AppStore');
    callback = alt.dispatcher.register.mock.calls[0][0];
  });

  const mockConnection = new ServerConnection('ws://localhost:9000');
  const actionConnection = {
    action: AppActions.CONNECTION,
    data: mockConnection
  };

  const mockAppState = states.LOBBY;
  const actionSetAppState = {
    action: AppActions.SET_APP_STATE,
    data: mockAppState
  };

  const mockPlayerType = playerTypes.CONSOLE;
  const actionSetPlayerType = {
    action: AppActions.SET_PLAYER_TYPE,
    data: mockPlayerType
  };

  const mockQuestion = 'What is your favorite kind of kid?';
  const actionSetCurrentQuestion = {
    action: AppActions.SET_CURRENT_QUESTION,
    data: mockQuestion
  };

  const mockAnswers = ['One', 'Two', 'Three'];
  const actionSetAnswers = {
    action: AppActions.SET_CURRENT_ANSWERS,
    data: mockAnswers
  };

  const actionReset = {
    action: AppActions.RESET_AND_END,
    data: null
  };

  // Initialization
  describe('#constructor', () => {
    it('registers a callback with the dispatcher', () => {
      expect(alt.dispatcher.register.mock.calls.length).toBe(1);
    });

    it('inits with no server connection', () => {
      const { conn } = AppStore.getState();
      expect(conn).toBe(null);
    });

    it('inits with an appState of "setup"', () => {
      const { appState } = AppStore.getState();
      expect(appState).toBe(states.INIT);
    });

    it('inits with an empty playerType', () => {
      const { playerType } = AppStore.getState();
      expect(playerType).toBe('');
    })

    it('inits with no current question', () => {
      const { question } = AppStore.getState();
      expect(question).toBe('');
    });

    it('inits with no current answers', () => {
      const { answers } = AppStore.getState();
      expect(answers).toEqual([]);
    });
  });

  describe('#onConnection', () => {
    it('sets the connection', () => {
      callback(actionConnection);

      const { conn } = AppStore.getState();
      expect(conn).toBe(mockConnection);
    });
  });

  describe('#onSetAppState', () => {
    it('updates the app state', () => {
      callback(actionSetAppState);

      const { appState } = AppStore.getState();
      expect(appState).toBe(mockAppState);
    });
  });

  describe('#onSetPlayerType', () => {
    it('sets the player type', () => {
      callback(actionSetPlayerType);

      const { playerType } = AppStore.getState();
      expect(playerType).toBe(mockPlayerType);
    });
  });

  describe('#onSetCurrentQuestion', () => {
    it('sets the current question', () => {
      callback(actionSetCurrentQuestion);

      const { question } = AppStore.getState();
      expect(question).toBe(mockQuestion);
    });
  });

  describe('#onSetCurrentAnswers', () => {
    it('sets the array of answers for guessing', () => {
      callback(actionSetAnswers);

      const { answers } = AppStore.getState();
      expect(answers).toBe(mockAnswers);
    });
  });

  describe('#onResetAndEnd', () => {
    it('resets the store', () => {
      callback(actionConnection);
      callback(actionSetAppState);
      callback(actionSetPlayerType);
      callback(actionSetCurrentQuestion);
      callback(actionSetAnswers);

      callback(actionReset);

      const {
        conn,
        appState,
        playerType,
        question,
        answers
      } = AppStore.getState();

      expect(conn).toBe(mockConnection);
      expect(appState).toBe(mockAppState);
      expect(playerType).toBe(mockPlayerType);
      expect(question).toBe('');
      expect(answers).toEqual([]);
    });
  });
});

jest.dontMock('../src/js/stores/PlayerStore');

import PlayerActions from '../src/js/actions/PlayerActions';

describe('PlayerStore', () => {

  let alt;
  let callback;
  let PlayerStore;

  beforeEach(() => {
    alt = require('../src/js/alt');
    alt.dispatcher = { register: jest.genMockFunction() };
    PlayerStore = require('../src/js/stores/PlayerStore');
    callback = alt.dispatcher.register.mock.calls[0][0];
  });

  const mockName = 'dollabill$';
  const actionUpdatePlayerName = {
    action: PlayerActions.UPDATE_PLAYER_NAME,
    data: mockName
  };

  const mockOtherName = 'messy J';
  const actionSetQuestionInfoMeTrue = {
    action: PlayerActions.SET_QUESTION_INFO,
    data: {
      about: mockName,
      answers: [mockOtherName, mockName]
    }
  };
  const actionSetQuestionInfoMeFalse = {
    action: PlayerActions.SET_QUESTION_INFO,
    data: {
      about: mockOtherName,
      answers: [mockOtherName]
    }
  };

  const actionIsGuessSubmittedTrue = {
    action: PlayerActions.IS_GUESS_SUBMITTED,
    data: [mockName]
  };

  const actionIsGuessSubmittedFalse = {
    action: PlayerActions.IS_GUESS_SUBMITTED,
    data: [mockOtherName]
  };

  const actionReset = {
    action: PlayerActions.RESET_AND_END,
    data: null
  };

  // Initialization
  describe('#constructor', () => {
    it('registers a callback with the dispatcher', () => {
      expect(alt.dispatcher.register.mock.calls.length).toBe(1);
    });

    it('inits with no playerName value', () => {
      const { playerName } = PlayerStore.getState();
      expect(playerName).toBe('');
    });

    it('inits with answerSubmitted as false', () => {
      const { answerSubmitted } = PlayerStore.getState();
      expect(answerSubmitted).toBe(false);
    });

    it('inits with guessSubmitted as false', () => {
      const { guessSubmitted } = PlayerStore.getState();
      expect(guessSubmitted).toBe(false);
    });

    it('inits with aboutMe as false', () => {
      const { aboutMe } = PlayerStore.getState();
      expect(aboutMe).toBe(false);
    });
  });

  describe('#onUpdatePlayerName', () => {
    it('sets the playerName value', () => {
      callback(actionUpdatePlayerName);

      const { playerName } = PlayerStore.getState();
      expect(playerName).toBe(mockName);
    });
  });

  describe('#onSetQuestionInfo', () => {
    beforeEach(() => {
      callback(actionUpdatePlayerName);
    });

    it('sets aboutMe as true when about current player', () => {
      callback(actionSetQuestionInfoMeTrue);

      const { aboutMe } = PlayerStore.getState();
      expect(aboutMe).toBe(true);
    });

    it('sets aboutMe as false when not about current player', () => {
      callback(actionSetQuestionInfoMeFalse);

      const { aboutMe } = PlayerStore.getState();
      expect(aboutMe).toBe(false);
    });

    it('sets answerSubmitted as false if current player name not in submitted answers array', () => {
      callback(actionSetQuestionInfoMeFalse);

      const { answerSubmitted } = PlayerStore.getState();
      expect(answerSubmitted).toBe(false);
    });

    it('sets answerSubmitted as true if current player name in submitted answers array', () => {
      callback(actionSetQuestionInfoMeTrue);

      const { answerSubmitted } = PlayerStore.getState();
      expect(answerSubmitted).toBe(true);
    });

    it('resets guessSubmitted to false', () => {
      callback(actionIsGuessSubmittedTrue);
      callback(actionSetQuestionInfoMeTrue);

      const { guessSubmitted } = PlayerStore.getState();
      expect(guessSubmitted).toBe(false);
    });
  });

  describe('#onIsGuessSubmitted', () => {
    beforeEach(() => {
      callback(actionUpdatePlayerName);
    });

    it('sets guessSubmitted as true if current player name in submitted guesses array', () => {
      callback(actionIsGuessSubmittedTrue);

      const { guessSubmitted } = PlayerStore.getState();
      expect(guessSubmitted).toBe(true);
    });

    it('sets guessSubmitted as false if current player name not in submitted guesses array', () => {
      callback(actionIsGuessSubmittedFalse);

      const { guessSubmitted } = PlayerStore.getState();
      expect(guessSubmitted).toBe(false);
    });
  });

  describe('#onResetAndEnd', () => {
    it('resets the store', () => {
      callback(actionUpdatePlayerName);
      callback(actionSetQuestionInfoMeTrue);
      callback(actionIsGuessSubmittedTrue);
      callback(actionReset);

      const {
        playerName,
        answerSubmitted,
        guessSubmitted,
        aboutMe
      } = PlayerStore.getState();

      expect(playerName).toBe('');
      expect(guessSubmitted).toBe(false);
      expect(guessSubmitted).toBe(false);
      expect(aboutMe).toBe(false);
    });
  });
});

jest.dontMock('../src/js/stores/GameConsoleStore');

import ConsoleActions from '../src/js/actions/ConsoleActions';

describe('GameConsoleStore', () => {

  let alt;
  let callback;
  let GameConsoleStore;

  beforeEach(() => {
    alt = require('../src/js/alt');
    alt.dispatcher = { register: jest.genMockFunction() };
    GameConsoleStore = require('../src/js/stores/GameConsoleStore');
    callback = alt.dispatcher.register.mock.calls[0][0];
  });

  const mockPlayers = ['dollabill$', 'messy J'];
  const actionSetPlayers = {
    action: ConsoleActions.SET_PLAYERS,
    data: mockPlayers
  };

  const mockQuestionAbout = mockPlayers[0];
  const actionSetQuestionInfo = {
    action: ConsoleActions.SET_QUESTION_INFO,
    data: {
      about: mockQuestionAbout,
      answers: mockPlayers
    }
  };

  const actionSetGuesses = {
    action: ConsoleActions.SET_GUESSES,
    data: mockPlayers
  };

  const mockGuessResults = {
    answers: ['One', 'Two', 'Three'],
    points: [1, 2, 3]
  };
  const actionAddGuessResults = {
    action: ConsoleActions.ADD_GUESS_RESULTS,
    data: mockGuessResults.answers
  };
  const actionAddPoints = {
    action: ConsoleActions.ADD_POINTS,
    data: mockGuessResults.points
  };

  const actionReset = {
    action: ConsoleActions.RESET_AND_END,
    data: null
  };

  // Initialization
  describe('#constructor', () => {
    it('registers a callback with the dispatcher', () => {
      expect(alt.dispatcher.register.mock.calls.length).toBe(1);
    });

    it('inits with an empty players array', () => {
      const { players } = GameConsoleStore.getState();
      expect(players).toEqual([]);
    });

    it('inits with an empty question about string', () => {
      const { questionAbout } = GameConsoleStore.getState();
      expect(questionAbout).toBe('');
    });

    it('inits with an empty submittedAnswers array', () => {
      const { submittedAnswers } = GameConsoleStore.getState();
      expect(submittedAnswers).toEqual([]);
    });

    it('inits with an empty submittedGuesses array', () => {
      const { submittedGuesses } = GameConsoleStore.getState();
      expect(submittedGuesses).toEqual([]);
    });

    it('inits with an empty guessResults array', () => {
      const { guessResults } = GameConsoleStore.getState();
      expect(guessResults).toEqual([]);
    });

    it('inits with an empty points array', () => {
      const { points } = GameConsoleStore.getState();
      expect(points).toEqual([]);
    });
  });

  describe('#onSetPlayers', () => {
    it('updates the players array', () => {
      callback(actionSetPlayers);

      const { players } = GameConsoleStore.getState();
      expect(players).toEqual(mockPlayers);
    });
  });

  describe('#onSetQuestionInfo', () => {
    it('sets who the question is about', () => {
      callback(actionSetQuestionInfo);

      const { questionAbout } = GameConsoleStore.getState();
      expect(questionAbout).toBe(mockQuestionAbout);
    });

    it('sets the list of current players who have answered', () => {
      callback(actionSetQuestionInfo);

      const { submittedAnswers } = GameConsoleStore.getState();
      expect(submittedAnswers).toEqual(mockPlayers);
    });

    it('resets question and answers queue', () => {
      callback(actionSetGuesses);
      callback(actionAddGuessResults);
      callback(actionAddPoints);
      callback(actionSetQuestionInfo);

      const {
        submittedGuesses,
        guessResults,
        points
      } = GameConsoleStore.getState();

      expect(submittedGuesses).toEqual([]);
      expect(guessResults).toEqual([]);
      expect(points).toEqual([]);
    });
  });

  describe('#onSetGuesses', () => {
    it('updates the list of players who submitted guesses', () => {
      callback(actionSetGuesses);

      const { submittedGuesses } = GameConsoleStore.getState();
      expect(submittedGuesses).toEqual(mockPlayers);
    });
  });

  describe('#onAddGuessResults', () => {
    it('updates the guesses results array', () => {
      callback(actionAddGuessResults);

      const { guessResults } = GameConsoleStore.getState();
      expect(guessResults).toEqual(mockGuessResults.answers);
    });
  });

  describe('#onAddPoints', () => {
    it('updates the points results array', () => {
      callback(actionAddPoints);

      const { points } = GameConsoleStore.getState();
      expect(points).toEqual(mockGuessResults.points);
    });
  });

  describe('#onResetAndEnd', () => {
    it('resets the store', () => {
      callback(actionSetPlayers);
      callback(actionSetQuestionInfo);
      callback(actionSetGuesses);
      callback(actionAddGuessResults);
      callback(actionAddPoints);
      callback(actionReset);

      const {
        players,
        questionAbout,
        submittedAnswers,
        submittedGuesses,
        guessResults,
        points
      } = GameConsoleStore.getState();

      expect(players).toEqual([]);
      expect(questionAbout).toBe('');
      expect(submittedAnswers).toEqual([]);
      expect(submittedGuesses).toEqual([]);
      expect(guessResults).toEqual([]);
      expect(points).toEqual([]);
    });
  });
});

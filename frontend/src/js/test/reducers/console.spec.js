import expect from 'expect';
import merge from 'lodash/object/merge'
import gameConsole from '../../reducers/console';
import {
  rootActionTypes,
  consoleActionTypes as types
} from '../../constants/actionConstants';

const initialState = {
  players: [],
  questionAbout: '',
  submittedAnswers: [],
  submittedGuesses: [],
  guessResults: [],
  points: [],
  timer: 0,
  timerInterval: null
};

describe('reducers/gameConsole', () => {
  it('should handle the initial state', () => {
    expect(
      gameConsole(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle SET_PLAYERS', () => {
    const players = ['dollabill$', 'messy J'];
    expect(
      gameConsole(undefined, {
        type: types.SET_PLAYERS,
        players
      })
    ).toEqual(merge({}, initialState, { players }));
  });

  it('should set a new question on SET_QUESTION_INFO', () => {
    const about = 'dollabill$';
    const answers = ['Yes', 'No', 'Maybe'];
    expect(gameConsole(undefined, {
      type: types.SET_QUESTION_INFO,
      about,
      answers
    })).toEqual(merge({}, initialState, {
      submittedAnswers: answers,
      questionAbout: about
    }));
  });

  it('should handle SET_GUESSES', () => {
    const submittedGuesses = ['billy'];
    expect(gameConsole(undefined, {
      type: types.SET_GUESSES,
      submittedGuesses
    })).toEqual(merge({}, initialState, { submittedGuesses }));
  });

  it('should handle ADD_GUESS_RESULTS', () => {
    const guessResults = ['billy'];
    expect(gameConsole(undefined, {
      type: types.ADD_GUESS_RESULTS,
      guessResults
    })).toEqual(merge({}, initialState, { guessResults }));
  });

  it('should handle ADD_POINTS', () => {
    const points = [1,2,3];
    expect(gameConsole(undefined, {
      type: types.ADD_POINTS,
      points
    })).toEqual(merge({}, initialState, { points }));
  });

  it('should handle SET_COMPONENT_TIMER', () => {
    const timerInfo = {
      timer: 60,
      timerInterval: 89
    };
    expect(gameConsole(undefined, {
      type: types.SET_COMPONENT_TIMER,
      timer: timerInfo.timer,
      timerInterval: timerInfo.timerInterval
    })).toEqual(merge({}, initialState, timerInfo));
  });

  it('should handle RESET_TIMER', () => {
    const timerInfo = {
      timer: 60,
      timerInterval: 89
    };
    gameConsole(undefined, {
      type: types.SET_COMPONENT_TIMER,
      timer: timerInfo.timer,
      timerInterval: timerInfo.timerInterval
    });

    expect(gameConsole(merge({}, initialState, timerInfo), {
      type: types.RESET_TIMER
    })).toEqual(initialState);
  });

  it('should handle decrement the timer if > 1 on DECREMENT_TIMER', () => {
    const timerInfo = {
      timer: 60,
      timerInterval: 89
    };
    gameConsole(undefined, {
      type: types.SET_COMPONENT_TIMER,
      timer: timerInfo.timer,
      timerInterval: timerInfo.timerInterval
    });

    expect(gameConsole(merge({}, initialState, timerInfo), {
      type: types.DECREMENT_TIMER
    })).toEqual(merge({}, initialState, {
      timer: (timerInfo.timer - 1),
      timerInterval: timerInfo.timerInterval
    }));
  });

  it('should reset the timer if timer === 1 on DECREMENT_TIMER', () => {
    const timerInfo = {
      timer: 1,
      timerInterval: 89
    };
    gameConsole(undefined, {
      type: types.SET_COMPONENT_TIMER,
      timer: timerInfo.timer,
      timerInterval: timerInfo.timerInterval
    });

    expect(gameConsole(merge({}, initialState, timerInfo), {
      type: types.DECREMENT_TIMER
    })).toEqual(merge({}, initialState, {
      timer: 0,
      timerInterval: null
    }));
  });

  it('should handle RESET_AND_END', () => {
    const timerInfo = {
      timer: 60,
      timerInterval: 89
    };
    gameConsole(undefined, {
      type: types.SET_COMPONENT_TIMER,
      timer: timerInfo.timer,
      timerInterval: timerInfo.timerInterval
    });

    expect(gameConsole(merge({}, initialState, timerInfo), {
      type: rootActionTypes.RESET_AND_END
    })).toEqual(initialState);
  });
});

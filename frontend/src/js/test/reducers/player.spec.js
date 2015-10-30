import expect from 'expect';
import merge from 'lodash/object/merge'
import player from '../../reducers/player';
import {
  rootActionTypes,
  playerActionTypes as types
} from '../../constants/actionConstants';

const initialState = {
  playerName: '',
  answerSubmitted: false,
  guessSubmitted: false,
  aboutMe: false
};

describe('reducers/player', () => {
  it('should handle the initial state', () => {
    expect(player(undefined, {})).toEqual(initialState);
  });

  it('should handle UPDATE_PLAYER_NAME', () => {
    const playerName = 'dollabill$';
    expect(
      player(undefined, {
        type: types.UPDATE_PLAYER_NAME,
        playerName
      })
    ).toEqual(merge({}, initialState, { playerName }));
  });

  it('should handle a question about me and a submitted answer on SET_QUESTION_INFO', () => {
    const about = 'dollabill$';
    const answers = ['dollabill$', 'messy J'];

    expect(player(merge({}, initialState, {
      playerName: about
    }), {
      type: types.SET_QUESTION_INFO,
      about,
      answers
    })).toEqual(merge({}, initialState, {
      playerName: about,
      answerSubmitted: true,
      aboutMe: true
    }));
  });

  it('should handle a question not about me and no submitted answer on SET_QUESTION_INFO', () => {
    const about = 'messy J';
    const answers = ['dollabill$'];

    expect(player(merge({}, initialState, {
      playerName: about
    }), {
      type: types.SET_QUESTION_INFO,
      about: 'dollabill$',
      answers
    })).toEqual(merge({}, initialState, {
      playerName: about,
      answerSubmitted: false,
      aboutMe: false
    }));
  });

  it('should handle guess submitted on IS_GUESS_SUBMITTED', () => {
    const playerName = 'dollabill$';
    const guesses = ['dollabill$'];

    expect(player(merge({}, initialState, {
      playerName
    }), {
      type: types.IS_GUESS_SUBMITTED,
      guesses
    })).toEqual(merge({}, initialState, {
      playerName,
      guessSubmitted: true
    }));
  });

  it('should handle guess not submitted on IS_GUESS_SUBMITTED', () => {
    const playerName = 'dollabill$';
    const guesses = ['messy J'];

    expect(player(merge({}, initialState, {
      playerName
    }), {
      type: types.IS_GUESS_SUBMITTED,
      guesses
    })).toEqual(merge({}, initialState, {
      playerName,
      guessSubmitted: false
    }));
  });

  it('should handle app.RESET_AND_END', () => {
    expect(player({
      playerName: 'dollabill$',
      answerSubmitted: true,
      guessSubmitted: true,
      aboutMe: true
    }, {
      type: rootActionTypes.RESET_AND_END
    })).toEqual(initialState);
  });
});

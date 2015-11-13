import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { setupShallowRender } from '../../helpers';
import states from '../../../constants/stateConstants';
import GameConsolePage from '../../../pages/GameConsolePage';
import GameLobby from '../../../components/game-console/GameLobby';
import QuestionComponent from '../../../components/game-console/QuestionComponent';
import GuessesComponent from '../../../components/game-console/GuessesComponent';
import ResultsComponent from '../../../components/game-console/ResultsComponent';
import GameOverComponent from '../../../components/game-console/GameOverComponent';

describe('pages/GameConsolePage', () => {
  let mockProps = {
    dispatch: expect.createSpy(),
    app: {
      appState: states.INIT,
      question: 'Who are you?',
      answers: []
    },
    gameConsole: {
      players: [],
      questionAbout: 'billy',
      submittedAnswers: [],
      submittedGuesses: [],
      guessResults: [],
      points: [],
      timer: 0
    }
  };

  it('should render GameLobby when appState === states.INIT', () => {
    const component = setupShallowRender(mockProps, GameConsolePage);
    const lobby = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(lobby.type).toEqual(GameLobby);
    expect(lobby.props.appState).toBe(mockProps.app.appState);
    expect(lobby.props.players).toEqual(mockProps.gameConsole.players);
  });

  it('should render GameLobby when appState === states.LOBBY', () => {
    mockProps.app.appState = states.LOBBY;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const lobby = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(lobby.type).toEqual(GameLobby);
    expect(lobby.props.appState).toBe(mockProps.app.appState);
    expect(lobby.props.players).toEqual(mockProps.gameConsole.players);
  });

  it('should render GameLobby when appState === states.INTRO', () => {
    mockProps.app.appState = states.INTRO;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const lobby = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(lobby.type).toEqual(GameLobby);
    expect(lobby.props.appState).toBe(mockProps.app.appState);
    expect(lobby.props.players).toEqual(mockProps.gameConsole.players);
  });

  it('should render QuestionComponent when appState === states.QUESTION_ASK', () => {
    mockProps.app.appState = states.QUESTION_ASK;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const question = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(question.type).toEqual(QuestionComponent);
    expect(question.props.question).toBe(mockProps.app.question);
    expect(question.props.timer).toEqual(mockProps.gameConsole.timer);
    expect(question.props.about).toBe(mockProps.gameConsole.questionAbout);
    expect(question.props.submittedAnswers).toEqual(mockProps.gameConsole.submittedAnswers);
  });

  it('should render GuessesComponent when appState === states.QUESTION_GUESS', () => {
    mockProps.app.appState = states.QUESTION_GUESS;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const question = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(question.type).toEqual(GuessesComponent);
    expect(question.props.question).toBe(mockProps.app.question);
    expect(question.props.answers).toEqual(mockProps.app.answers);
    expect(question.props.submittedGuesses).toBe(mockProps.gameConsole.submittedGuesses);
    expect(question.props.timer).toEqual(mockProps.gameConsole.timer);
  });

  it('should render ResultsComponent when appState === states.SHOW_RESULTS', () => {
    mockProps.app.appState = states.SHOW_RESULTS;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const question = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(question.type).toEqual(ResultsComponent);
    expect(question.props.appState).toBe(mockProps.app.appState);
    expect(question.props.question).toEqual(mockProps.app.question);
    expect(question.props.guessResults).toBe(mockProps.gameConsole.guessResults);
    expect(question.props.points).toEqual(mockProps.gameConsole.points);
  });

  it('should render ResultsComponent when appState === states.SHOW_POINTS', () => {
    mockProps.app.appState = states.SHOW_POINTS;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const question = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(question.type).toEqual(ResultsComponent);
    expect(question.props.appState).toBe(mockProps.app.appState);
    expect(question.props.question).toEqual(mockProps.app.question);
    expect(question.props.guessResults).toBe(mockProps.gameConsole.guessResults);
    expect(question.props.points).toEqual(mockProps.gameConsole.points);
  });

  it('should render GameOverComponent when appState === states.GAME_OVER', () => {
    mockProps.app.appState = states.GAME_OVER;
    const component = setupShallowRender(mockProps, GameConsolePage);
    const question = component.props.children.props.children;

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('game-console-page');
    expect(component.props.children.type).toBe('div');
    expect(component.props.children.props.className).toBe('game-console-page-content');

    expect(question.type).toEqual(GameOverComponent);
    expect(question.props.points).toEqual(mockProps.gameConsole.points);
  });
});

import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import { setupShallowRender, setupRender } from '../../helpers';
import states from '../../../constants/stateConstants';
import InGamePage from '../../../pages/InGamePage';
import LobbyComponent from '../../../components/in-game/LobbyComponent';
import QuestionComponent from '../../../components/in-game/QuestionComponent';
import GuessingComponent from '../../../components/in-game/GuessingComponent';
import GameOverComponent from '../../../components/in-game/GameOverComponent';

describe('pages/InGamePage', () => {
  let mockProps = {
    history: {
      pushState: expect.createSpy()
    },
    dispatch: expect.createSpy(),
    app: {
      appState: states.INIT,
      question: 'Who are you?',
      answers: []
    },
    player: {
      playerName: 'billy',
      aboutMe: false,
      answerSubmitted: true,
      guessSubmitted: false
    },
    gameConsole: {
      players: [],
      questionAbout: 'billy'
    }
  };

  it('should render the LobbyComponent when appState === states.INIT', () => {
    const component = setupShallowRender(mockProps, InGamePage);
    const lobby = component.props.children;

    expect(component.type).toBe('span');
    expect(lobby.type).toEqual(LobbyComponent);
    expect(lobby.props.playerName).toBe(mockProps.player.playerName);
    expect(lobby.props.players).toEqual(mockProps.gameConsole.players);
  });

  it('should render the LobbyComponent when appState === states.LOBBY', () => {
    mockProps.app.appState = states.LOBBY;
    const component = setupShallowRender(mockProps, InGamePage);
    const lobby = component.props.children;

    expect(component.type).toBe('span');
    expect(lobby.type).toEqual(LobbyComponent);
    expect(lobby.props.playerName).toBe(mockProps.player.playerName);
    expect(lobby.props.players).toEqual(mockProps.gameConsole.players);
  });

  it('should render intro text when appState === states.INTRO', () => {
    mockProps.app.appState = states.INTRO;
    const component = setupShallowRender(mockProps, InGamePage);
    expect(component).toEqual(
      <span>
        <h1>Game starting, please hold...</h1>
      </span>
    );
  });

  it('should render the QuestionComponent when appState === states.QUESTION_ASK', () => {
    mockProps.app.appState = states.QUESTION_ASK;
    const component = setupShallowRender(mockProps, InGamePage);
    const question = component.props.children;

    expect(component.type).toBe('span');
    expect(question.type).toEqual(QuestionComponent);
    expect(question.props.question).toBe(mockProps.app.question);
    expect(question.props.aboutMe).toEqual(mockProps.player.aboutMe);
    expect(question.props.questionAbout).toEqual(mockProps.gameConsole.questionAbout);
    expect(question.props.playerName).toEqual(mockProps.player.playerName);
    expect(question.props.answerSubmitted).toEqual(mockProps.player.answerSubmitted);
  });

  it('should render the GuessingComponent when appState === states.QUESTION_GUESS', () => {
    mockProps.app.appState = states.QUESTION_GUESS;
    const component = setupShallowRender(mockProps, InGamePage);
    const guessing = component.props.children;

    expect(component.type).toBe('span');
    expect(guessing.type).toEqual(GuessingComponent);
    expect(guessing.props.answers).toBe(mockProps.app.answers);
    expect(guessing.props.aboutMe).toEqual(mockProps.player.aboutMe);
    expect(guessing.props.questionAbout).toEqual(mockProps.gameConsole.questionAbout);
    expect(guessing.props.guessSubmitted).toEqual(mockProps.player.guessSubmitted);
    expect(guessing.props.playerName).toEqual(mockProps.player.playerName);
  });

  it('should render results text when appState === states.SHOW_RESULTS', () => {
    mockProps.app.appState = states.SHOW_RESULTS;
    const component = setupShallowRender(mockProps, InGamePage);
    expect(component).toEqual(
      <span>
        <h1>Hang tight for this round's results!</h1>
      </span>
    );
  });

  it('should render results text when appState === states.SHOW_POINTS', () => {
    mockProps.app.appState = states.SHOW_POINTS;
    const component = setupShallowRender(mockProps, InGamePage);
    expect(component).toEqual(
      <span>
        <h1>Hang tight for this round's results!</h1>
      </span>
    );
  });

  it('should render the GameOverComponent when appState === states.GAME_OVER', () => {
    mockProps.app.appState = states.GAME_OVER;
    const component = setupShallowRender(mockProps, InGamePage);
    expect(component.type).toBe(GameOverComponent);
  });

  it('should call pushState if no playerName is present', () => {
    mockProps.player.playerName = '';
    const component = setupRender(mockProps, InGamePage);
    expect(mockProps.history.pushState.calls.length).toBe(1);
  });
});

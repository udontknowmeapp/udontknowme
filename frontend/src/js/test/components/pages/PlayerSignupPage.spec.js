import expect from 'expect';
import React from 'react';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import { setupRender, setupShallowRender } from '../../helpers';
import PlayerSignupPage from '../../../pages/PlayerSignupPage';

describe('pages/PlayerSignupPage', () => {
  const mockProps = {
    history: {
      pushState: expect.createSpy()
    },
    dispatch: expect.createSpy(),
    player: {
      playerName: ''
    }
  };

  it('should render the component content', () => {
    const component = setupShallowRender(mockProps, PlayerSignupPage);

    expect(component.type).toBe('div');
    expect(component.props.className).toBe('player-signup');

    const secondLevel = component.props.children;
    expect(secondLevel.type).toBe('div');
    expect(secondLevel.props.className).toBe('player-signup-content');

    const [ h1, input, br, button ] = secondLevel.props.children;
    expect(h1.type).toBe('h1');
    expect(h1.props.children).toBe('Pick Your Name');
    expect(input.type).toBe('input');
    expect(input.props.className).toBe('player-signup-content__input');
    expect(input.props.type).toBe('text');
    expect(input.props.value).toBe(mockProps.player.playerName);
    expect(button.type).toBe('button');
    expect(button.props.className).toBe('player-signup-content__button')
  });

  it('should call onNameInput to update state on input change', () => {
    const component = setupRender(mockProps, PlayerSignupPage);
    const input = TestUtils.findRenderedDOMComponentWithClass(component, 'player-signup-content__input');

    expect(component.state.newPlayerName).toBe('');
    Simulate.change(input, { target: { value: 'billy' }});
    expect(component.state.newPlayerName).toBe('billy');
  });

  it('should reset the state on button click', () => {
    const component = setupRender(mockProps, PlayerSignupPage);
    const input = TestUtils.findRenderedDOMComponentWithClass(component, 'player-signup-content__input');
    const button = TestUtils.findRenderedDOMComponentWithClass(component, 'player-signup-content__button');

    Simulate.change(input, { target: { value: 'billy' }});
    expect(component.state.newPlayerName).toBe('billy');
    Simulate.click(button);
    expect(component.state.newPlayerName).toBe('');
  });

  it('should call dispatch on button click', () => {
    const component = setupRender(mockProps, PlayerSignupPage);
    const input = TestUtils.findRenderedDOMComponentWithClass(component, 'player-signup-content__input');
    const button = TestUtils.findRenderedDOMComponentWithClass(component, 'player-signup-content__button');

    Simulate.change(input, { target: { value: 'billy' }});
    expect(component.state.newPlayerName).toBe('billy');
    Simulate.click(button);
    expect(mockProps.dispatch.calls.length).toBe(2);
  });

  it('should call pushState if playerName prop is set', () => {
    mockProps.player.playerName = 'billy';
    const component = setupShallowRender(mockProps, PlayerSignupPage);
    expect(mockProps.history.pushState.calls.length).toBe(1);
  });
});

import expect from 'expect';
import React from 'react';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import { setupRender, setupShallowRender } from '../../helpers';
import GuessingItem from '../../../components/in-game/GuessingItem';

describe('components/in-game/GuessingItem', () => {
  const mockProps = {
    answer: 'Who are you?',
    submitGuess: expect.createSpy()
  };

  it('should call submitGuess on button click', () => {
    const component = setupRender(mockProps, GuessingItem);
    const button = TestUtils.findRenderedDOMComponentWithClass(component, 'guessing-page-content__button');

    Simulate.click(button);
    expect(mockProps.submitGuess.calls.length).toBe(1);
  });
});

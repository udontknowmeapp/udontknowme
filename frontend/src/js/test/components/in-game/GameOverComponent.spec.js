import expect from 'expect';
import React from 'react';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import { setupRender, setupShallowRender } from '../../helpers';
import GameOverComponent from '../../../components/in-game/GameOverComponent';

describe('components/in-game/GameOverComponent', () => {
  const mockProps = {
    startNewGame: expect.createSpy()
  };

  it('should render the component content', () => {
    const component = setupShallowRender(mockProps, GameOverComponent);

    expect(component).toEqual(
      <div className='lobby'>
        <div className='lobby-content'>
          <button
            className='lobby-button'
            onClick={mockProps.startNewGame}
          >New Game</button>
        </div>
      </div>
    );
  });

  it('should call startNewGame on button click', () => {
    const component = setupRender(mockProps, GameOverComponent);
    const button = TestUtils.findRenderedDOMComponentWithClass(component, 'lobby-button');
    Simulate.click(button);
    expect(mockProps.startNewGame.calls.length).toBe(1);
  });
});

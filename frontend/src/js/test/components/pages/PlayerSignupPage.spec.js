import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import PlayerSignupPage from '../../../pages/PlayerSignupPage';

function setup() {
  const props = {
    history: {
      pushState: expect.createSpy()
    },
    dispatch: expect.createSpy(),
    player: {
      playerName: ''
    }
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<PlayerSignupPage {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props,
    output
  };
}

describe('pages/PlayerSignupPage', () => {
  it('should render the container', () => {
    const { output } = setup();
    expect(output.type).toBe('div');
    expect(output.props.className).toBe('player-signup');
  });
});

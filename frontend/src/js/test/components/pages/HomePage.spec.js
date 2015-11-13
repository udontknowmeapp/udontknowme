import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import { setupShallowRender } from '../../helpers';
import HomePage from '../../../pages/HomePage';

describe('pages/HomePage', () => {
  it('should render the component content', () => {
    const component = setupShallowRender({}, HomePage);

    expect(component).toEqual(
      <div className='home-page'>
        <div className='home-page__content'>
          <h1 className='home-page__header'>U Don't Know Me!</h1>
          <Link
            className='home-page__link'
            to='/player-signup'
          >Sign Up To Play</Link>
          <Link
            className='home-page__link'
            to='/game-console'
          >Start A Game</Link>
        </div>
      </div>
    );
  });
});

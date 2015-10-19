import React, { Component } from 'react';
import { Link } from 'react-router';

export default class HomePage extends Component {
  render() {
    return (
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
  }
}

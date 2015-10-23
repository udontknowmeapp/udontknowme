import React, { Component, PropTypes } from 'react';
import renderRouteChildren from '../utils/renderRouteChildren';
import messages from '../constants/messagesConstants';

export default class InGameWrapper extends Component {

  static propTypes = {
    startNewGame: PropTypes.func,
  }

  render() {
    const { startNewGame } = this.props;

    return (
      <span>
        <button
          className='player-signup-content__button'
          onClick={startNewGame}
        >New Game</button>
        {renderRouteChildren(this.props)}
      </span>
    );
  }
}

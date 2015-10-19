import React, { Component, PropTypes } from 'react';
import renderRouteChildren from '../utils/renderRouteChildren';
import messages from '../constants/messagesConstants';

export default class InGameWrapper extends Component {

  static propTypes = {
    conn: PropTypes.object,
    playerType: PropTypes.string,
    playerName: PropTypes.string
  }

  render() {
    return (
      <span>
        <button
          className='player-signup-content__button'
          onClick={this.startNewGame.bind(this)}
        >New Game</button>
        {renderRouteChildren(this.props)}
      </span>
    );
  }

  startNewGame() {
    const { conn, playerType, playerName } = this.props;
    conn.send(
      playerType,
      playerName.length ? playerName : null,
      messages.NEW_GAME
    );
  }
}

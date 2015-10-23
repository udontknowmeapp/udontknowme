import React, { Component, PropTypes } from 'react';

export default class LobbyComponent extends Component {

  static propTypes = {
    playerName: PropTypes.string,
    players: PropTypes.array,
    startGame: PropTypes.func
  }

  render() {
    const { playerName, players, startGame } = this.props;

    return (
      <div className='lobby'>
        <div className='lobby-content'>
          <h1>Welcome, {playerName}!</h1>
          <div className='lobby-content-list'>
            <p>Waiting on a few more to join...</p>
          </div>

          {
            !players.length ||
              <button
                className='lobby-button'
                onClick={startGame}
              >Start Game</button>
          }
        </div>
      </div>
    );
  }
}

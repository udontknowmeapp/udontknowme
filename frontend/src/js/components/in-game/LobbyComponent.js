import React, { Component, PropTypes } from 'react';
import PlayerActions from '../../actions/PlayerActions';

export default class LobbyComponent extends Component {

  static propTypes = {
    conn: PropTypes.object,
    playerName: PropTypes.string,
    players: PropTypes.array
  }

  render() {
    const { playerName, players } = this.props;

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
                onClick={this.startGame.bind(this)}
              >Start Game</button>
          }
        </div>
      </div>
    );
  }

  startGame() {
    const { conn, playerName } = this.props;
    PlayerActions.startGame(conn, playerName);
  }
}

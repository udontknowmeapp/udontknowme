import React, { Component, PropTypes } from 'react';

class LobbyComponent extends Component {
  render() {
    const { playerName, players, actions } = this.props;

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
                onClick={actions.startGame}
              >Start Game</button>
          }
        </div>
      </div>
    );
  }
}

LobbyComponent.propTypes = {
  playerName: PropTypes.string,
  players: PropTypes.array,
  actions: PropTypes.object
};

export default LobbyComponent;

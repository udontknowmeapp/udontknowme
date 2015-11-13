import React, { Component, PropTypes } from 'react';
import states from '../../constants/stateConstants';

class GameLobby extends Component {
  componentDidUpdate(prevProps) {
    const { appState, actions } = this.props;
    if (appState === states.INTRO && prevProps.appState === states.LOBBY) {
      setTimeout(() => actions.introCompleted(), 3000);
    }
  }

  render() {
    const { players, appState } = this.props;

    return (
      <div className='console-lobby'>
        <h1>U Don't Know Me!</h1>

        <p>Players in the lobby:</p>
        <ul>
          {players.map(player => <li>{player}</li>)}
        </ul>

        {
          appState === states.INTRO &&
            <div>
              <p>And we're ready to go!</p>
              <p>You're all horrible so this should be fun...</p>
            </div>
        }
        {
          appState !== states.INTRO && !players.length ||
            <div>
              <p>Waiting for players to join...</p>
            </div>
        }
      </div>
    );
  }
}

GameLobby.propTypes = {
  appState: PropTypes.string,
  players: PropTypes.array,
  actions: PropTypes.obj
}

export default GameLobby;

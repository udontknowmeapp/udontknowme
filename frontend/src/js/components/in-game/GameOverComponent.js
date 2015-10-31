import React, { Component, PropTypes } from 'react';

class GameOverComponent extends Component {
  render() {
    const { startNewGame } = this.props;

    return (
      <div className='lobby'>
        <div className='lobby-content'>
          <button
            className='lobby-button'
            onClick={startNewGame}
          >New Game</button>
        </div>
      </div>
    );
  }
}

GameOverComponent.propTypes = {
  startNewGame: PropTypes.func
};

export default GameOverComponent;

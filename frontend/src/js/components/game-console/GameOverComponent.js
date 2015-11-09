import React, { Component, PropTypes } from 'react';
import PointsItem from './PointsItem';

class GameOverComponent extends Component {
  render() {
    const { points, actions } = this.props;

    return (
      <div>
        <h2>Game Over!</h2>
        <br />
        <h3>Points</h3>
        <ul className='console-questions-list'>
          {
            points.map((p, i) => {
              return (
                <PointsItem
                  key={i}
                  playerName={p.player}
                  points={p.points}
                  winner={i === 0 ? true : false}
                />
              );
            })
          }
        </ul>
        <br />
        <button
          className='lobby-button'
          onClick={actions.startNewGame}
        >New Game</button>
      </div>
    );
  }
}

GameOverComponent.propTypes = {
  points: PropTypes.array,
  actions: PropTypes.object
};

export default GameOverComponent;

import React, { Component, PropTypes } from 'react';

class ResultsComponent extends Component {
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
                <li key={i}>
                  <em>{p.player} {i === 0 && '(Winner)'}</em> - {p.points}
                </li>
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

ResultsComponent.propTypes = {
  points: PropTypes.array,
  actions: PropTypes.object
};

export default ResultsComponent;

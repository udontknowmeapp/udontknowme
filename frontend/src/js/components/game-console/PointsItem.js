import React, { Component, PropTypes } from 'react';

class PointsItem extends Component {
  render() {
    const { playerName, points, winner } = this.props;

    return (
      <li>
        <em>{playerName} {winner && '(Winner)'}</em> - {points}
      </li>
    );
  }
}

PointsItem.propTypes = {
  playerName: PropTypes.string,
  points: PropTypes.number,
  winner: PropTypes.bool
};

export default PointsItem;

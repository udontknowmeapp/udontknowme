import React, { Component, PropTypes } from 'react';
import renderRouteChildren from '../utils/renderRouteChildren';
import { startNewGame } from '../actions/AppActions';

export default class InGameWrapper extends Component {

  static propTypes = {
    dispatch: PropTypes.func
  }

  render() {
    return (
      <span>
        <button
          className='player-signup-content__button'
          onClick={this.newGame.bind(this)}
        >New Game</button>
        {renderRouteChildren(this.props)}
      </span>
    );
  }

  newGame() {
    const { dispatch } = this.props;
    dispatch(startNewGame());
  }
}

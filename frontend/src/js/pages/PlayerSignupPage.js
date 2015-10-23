import React, { Component, PropTypes } from 'react';
import PlayerActions from '../actions/PlayerActions';

export default class PlayerSignupPage extends Component {

  static propTypes = {
    // ReactRouter Props
    history: PropTypes.object,

    // player props
    player: PropTypes.shape({
      playerName: PropTypes.string
    }),

    // actions props
    setPlayerName: PropTypes.func
  }

  constructor(props) {
    super(props);

    const { player, history } = this.props;
    if (player.playerName) {
      history.pushState(null, '/in-game');
    }

    this.state = {
      newPlayerName: ''
    };
  }

  componentDidUpdate() {
    const { player, history } = this.props;
    if (player.playerName) {
      history.pushState(null, '/in-game');
    }
  }

  render() {
    const { newPlayerName } = this.state;

    return (
      <div className='player-signup'>
        <div className='player-signup-content'>
          <h1>Pick Your Name</h1>
          <input
            className='player-signup-content__input'
            type='text'
            placeholder='Your name here...'
            value={newPlayerName}
            onChange={this.onNameInput.bind(this)}
          />
          <br />
          <button
            className='player-signup-content__button'
            onClick={this.submitPlayerName.bind(this)}>Submit</button>
        </div>
      </div>
    );
  }

  onNameInput(event) {
    this.setState({ newPlayerName: event.target.value });
  }

  submitPlayerName() {
    const { newPlayerName } = this.state;
    const { setPlayerName } = this.props;

    this.setState({ newPlayerName: '' });
    setPlayerName(newPlayerName);
  }
}

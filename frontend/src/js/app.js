import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import renderRouteChildren from './utils/renderRouteChildren';
import { connection } from './actions/AppActions';

class App extends Component {

  static propTypes = {
    // app props
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.shape({
      conn: PropTypes.object.isRequired,
      appState: PropTypes.string.isRequired,
      playerType: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      answers: PropTypes.array.isRequired
    }).isRequired,

    // player props
    player: PropTypes.shape({
      playerName: PropTypes.string.isRequired,
      answerSubmitted: PropTypes.bool.isRequired,
      guessSubmitted: PropTypes.bool.isRequired,
      aboutMe: PropTypes.bool.isRequired
    }).isRequired,

    // gameConsole props
    gameConsole: PropTypes.shape({
      players: PropTypes.array.isRequired,
      questionAbout: PropTypes.string.isRequired,
      submittedAnswers: PropTypes.array.isRequired,
      submittedGuesses: PropTypes.array.isRequired,
      guessResults: PropTypes.array.isRequired,
      points: PropTypes.array.isRequired,
      timer: PropTypes.number.isRequired
    })
  }

  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    dispatch(connection(dispatch));
  }

  render() {
    return (
      <div className='body'>
        {renderRouteChildren(this.props)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { app, player, gameConsole, router } = state;
  return {
    app,
    player,
    gameConsole,
    router
  };
}

export default connect(mapStateToProps)(App);

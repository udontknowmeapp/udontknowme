import React, { Component, PropTypes } from 'react';
import merge from 'lodash/object/merge';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import renderRouteChildren from './utils/renderRouteChildren';
import * as AppActions from './actions/appActions';
import * as ConsoleActions from './actions/consoleActions';
import * as PlayerActions from './actions/playerActions';

class App extends Component {

  static propTypes = {
    // app props
    app: PropTypes.shape({
      conn: PropTypes.bool.isRequired,
      appState: PropTypes.state.isRequired,
      playerType: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      answers: PropTypes.array.isRequired
    }).isRequired,

    // player props
    player: PropTypes.shape({
      playerName: PropTypes.string.isRequired,
      answerSubmtted: PropTypes.bool.isRequired,
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
    });
  }

  constructor(props) {
    super(props);

    const { connection } = this.props;
    connection();
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(merge(
    AppActions,
    ConsoleActions,
    PlayerActions
  ), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

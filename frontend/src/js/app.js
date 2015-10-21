import React, { Component, PropTypes } from 'react';
import merge from 'lodash/object/merge';
import connectToStores from 'alt/utils/connectToStores';
import renderRouteChildren from './utils/renderRouteChildren';
import AppStore from './stores/AppStore';
import GameConsoleStore from './stores/GameConsoleStore';
import PlayerStore from './stores/PlayerStore';
import AppActions from './actions/AppActions';

@connectToStores
export default class App extends Component {

  static propTypes = {
    // AppStore props
    conn: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    playerType: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,

    // PlayerStore props
    playerName: PropTypes.string.isRequired,
    answerSubmtted: PropTypes.bool.isRequired,
    guessSubmitted: PropTypes.bool.isRequired,
    aboutMe: PropTypes.bool.isRequired,

    // GameConsoleStore Props
    players: PropTypes.array.isRequired,
    questionAbout: PropTypes.string.isRequired,
    submittedAnswers: PropTypes.array.isRequired,
    submittedGuesses: PropTypes.array.isRequired,
    guessResults: PropTypes.array.isRequired,
    points: PropTypes.array.isRequired,
    timer: PropTypes.number.isRequired
  }

  static getStores() {
    return [AppStore, GameConsoleStore, PlayerStore];
  }

  static getPropsFromStores() {
    return merge(
      AppStore.getState(),
      PlayerStore.getState(),
      GameConsoleStore.getState()
    );
  }

  constructor(props) {
    super(props);

    const sessionInfo = AppStore.checkCachedSession();
    AppActions.connection(sessionInfo);
  }

  render() {
    return (
      <div className='body'>
        {renderRouteChildren(this.props)}
      </div>
    );
  }
}

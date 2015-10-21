import React, { Component, PropTypes } from 'react';
import ConsoleActions from '../actions/ConsoleActions';
import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';

export default function TimerWrapper(WrappedComponent) {
  return class WrappedComponent extends Component {

    static propTypes = {
      conn: PropTypes.object
    }

    constructor(props) {
      super(props);

      // First, reset a rogue timer
      ConsoleActions.resetTimer();

      const { conn } = this.props;
      conn.send(playerTypes.CONSOLE, null, messages.START_TIMER);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

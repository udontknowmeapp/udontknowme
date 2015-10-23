import React, { Component, PropTypes } from 'react';
import messages from '../constants/messagesConstants';
import playerTypes from '../constants/playerTypeConstants';

export default function TimerWrapper(WrappedComponent) {
  return class WrappedComponent extends Component {

    static propTypes = {
      resetTimer: PropTypes.func,
      startTimer: PropTypes.func
    }

    constructor(props) {
      super(props);

      const { resetTimer, startTimer };
      resetTimer();
      startTimer();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

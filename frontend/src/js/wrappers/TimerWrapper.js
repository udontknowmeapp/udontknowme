import React, { Component, PropTypes } from 'react';

export default function TimerWrapper(WrappedComponent) {
  return class WrappedComponent extends Component {

    static propTypes = {
      actions: PropTypes.object
    }

    constructor(props) {
      super(props);

      const { actions } = this.props;
      actions.resetTimer();
      actions.startTimer();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

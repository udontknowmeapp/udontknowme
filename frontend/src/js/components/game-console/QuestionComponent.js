import React, { Component, PropTypes } from 'react';

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: null
    };
  }

  componentDidUpdate() {
    const { timer, actions } = this.props;
    const { interval } = this.state;

    if (timer > 0 && interval === null) {
      this.setState({
        interval: setInterval(() => actions.decrementTimer(), 1000)
      });
    }

    if (timer === 0 && interval !== null) {
      clearInterval(interval);
      this.setState({
        interval: null
      });
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;
    const { interval } = this.state;

    actions.resetTimer();
    clearInterval(interval);
  }

  render() {
    const { timer, question, about, submittedAnswers } = this.props;

    return (
      <div>
        <h2>{question}</h2>
        <p className='console-about'>This one's about {about}.</p>
        <br />
        <p><strong>Seconds Left</strong> - {timer}</p>
        <br />
        <ul className='console-questions-list'>
          {submittedAnswers.map(player => {
            return <li>{player} submitted an answer.</li>;
          })}
        </ul>
      </div>
    );
  }
}

QuestionComponent.propTypes = {
  timer: PropTypes.number,
  question: PropTypes.string,
  about: PropTypes.string,
  submittedAnswers: PropTypes.array,
  actions: PropTypes.object
};

export default QuestionComponent;

import React, { Component, PropTypes } from 'react';

class GuessesComponent extends Component {
  constructor(props) {
    super(props);

    const { actions } = this.props;
    this.state = {
      interval: setInterval(() => actions.decrementTimer(), 1000)
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;
    const { interval } = this.state;

    actions.resetTimer();
    clearInterval(interval);
  }

  render() {
    const { timer, question, answers, submittedGuesses } = this.props;

    return (
      <div>
        <h2>{question}</h2>
        <p className='console-about'>The answers...</p>
        <ul className='console-questions-list'>
          {
            answers.map((answer, i) => {
              return <li key={i}>{answer.answer}</li>;
            })
          }
        </ul>
        <br />
        <p><strong>Seconds Left</strong> - {timer}</p>
        <br />
        <ul className='console-questions-list'>
          {
            submittedGuesses.map((player, i) => {
              return <li key={i}>{player} submited a guess.</li>;
            })
          }
        </ul>
      </div>
    );
  }
}

GuessesComponent.propTypes = {
  timer: PropTypes.number,
  question: PropTypes.string,
  answers: PropTypes.array,
  submittedGuesses: PropTypes.array,
  actions: PropTypes.object
};

export default GuessesComponent;

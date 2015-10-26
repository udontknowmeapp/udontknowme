import React, { Component, PropTypes } from 'react';
// import TimerWrapper from '../../wrappers/TimerWrapper';

export default class GuessesComponent extends Component {

  static propTypes = {
    timer: PropTypes.timer,
    question: PropTypes.string,
    answers: PropTypes.array,
    submittedGuesses: PropTypes.array,
    actions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { actions } = this.props;
    actions.resetTimer();
    actions.startTimer();
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

// export default TimerWrapper(GuessesComponent);

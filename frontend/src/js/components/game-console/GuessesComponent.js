import React, { Component, PropTypes } from 'react';

export default class GuessesComponent extends Component {

  static propTypes = {
    question: PropTypes.string,
    answers: PropTypes.array,
    submittedGuesses: PropTypes.array
  }

  render() {
    const { question, answers, submittedGuesses } = this.props;

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

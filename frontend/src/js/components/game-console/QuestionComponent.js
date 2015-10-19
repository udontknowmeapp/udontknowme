import React, { Component, PropTypes } from 'react';

export default class QuestionComponent extends Component {

  static propTypes = {
    question: PropTypes.string,
    about: PropTypes.string,
    submittedAnswers: PropTypes.array
  }

  render() {
    const { question, about, submittedAnswers } = this.props;

    return (
      <div>
        <h2>{question}</h2>
        <p className='console-about'>This one's about {about}.</p>
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

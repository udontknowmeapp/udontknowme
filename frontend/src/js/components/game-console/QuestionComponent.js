import React, { Component, PropTypes } from 'react';
import TimerWrapper from '../../wrappers/TimerWrapper';

class QuestionComponent extends Component {

  static propTypes = {
    timer: PropTypes.number,
    question: PropTypes.string,
    about: PropTypes.string,
    submittedAnswers: PropTypes.array
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

export default TimerWrapper(QuestionComponent);

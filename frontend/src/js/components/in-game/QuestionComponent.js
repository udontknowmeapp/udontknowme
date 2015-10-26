import React, { Component, PropTypes } from 'react';

export default class QuestionComponent extends Component {

  static propTypes = {
    question: PropTypes.string,
    aboutMe: PropTypes.bool,
    questionAbout: PropTypes.string,
    playerName: PropTypes.string,
    answerSubmitted: PropTypes.bool,
    actions: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      answer: ''
    };
  }

  render() {
    const { question, aboutMe, questionAbout, answerSubmitted } = this.props;
    const { answer } = this.state;

    return (
      <div className='question-page'>
        <div className='question-page-content'>
          <h1>{question}</h1>
          <br />
          <p>
            {
              aboutMe ?
                'This one\'s about you. Put something obvious for yourself!'
                :
                `This one's about ${questionAbout}. What do you think their \
                answer will be?`
            }
          </p>
          {
            answerSubmitted ?
              <p>Hang tight while everyone else submits an answer!</p>
              :
              <span>
                <input
                  className='question-page-content__input'
                  type='text'
                  value={answer}
                  placeholder='Your answer here...'
                  onChange={this.onAnswerInput.bind(this)}
                />
                <br />
                <button
                  className='question-page-content__button'
                  onClick={this.submitAnswer.bind(this)}
                >Submit Answer</button>
              </span>
          }
        </div>
      </div>
    );
  }

  onAnswerInput(event) {
    this.setState({ answer: event.target.value });
  }

  submitAnswer() {
    const { answer } = this.state;
    const { actions } = this.props;

    this.setState({ answer: '' });
    actions.submitAnswer(answer);
  }
}

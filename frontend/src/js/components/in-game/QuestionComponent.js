import React, { Component, PropTypes } from 'react';
import PlayerActions from '../../actions/PlayerActions';

export default class QuestionComponent extends Component {

  static propTypes = {
    question: PropTypes.string,
    aboutMe: PropTypes.bool,
    playerName: PropTypes.string,
    answerSubmitted: PropTypes.bool,
    conn: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      answer: ''
    };
  }

  render() {
    const { question, aboutMe, answerSubmitted } = this.props;
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
                'What do you think your friend\'s answer will be?'
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
    const { playerName, conn } = this.props;

    this.setState({ answer: '' });
    PlayerActions.submitAnswer(playerName, answer, conn);
  }
}

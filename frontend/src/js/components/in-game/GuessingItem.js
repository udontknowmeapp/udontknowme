import React, { Component, PropTypes } from 'react';

export default class GuessingItem extends Component {

  static propTypes = {
    answer: PropTypes.string,
    submitGuess: PropTypes.func
  }

  render() {
    const { answer } = this.props;

    return (
      <li className='guessing-page-content__list'>
        <button
          className='guessing-page-content__button'
          onClick={this.submitAsChoice.bind(this)}
        >
          {answer.answer}
        </button>
      </li>
    );
  }

  submitAsChoice() {
    const { submitGuess, answer } = this.props;
    submitGuess(answer.answer);
  }
}

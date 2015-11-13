import React, { Component, PropTypes } from 'react';

class GuessingItem extends Component {
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

GuessingItem.propTypes = {
  answer: PropTypes.string,
  submitGuess: PropTypes.func
};

export default GuessingItem;

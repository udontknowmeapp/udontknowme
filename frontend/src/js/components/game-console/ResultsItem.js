import React, { Component, PropTypes } from 'react';

class ResultsItem extends Component {
  render() {
    const { guessed, author, answer, truth } = this.props;

    return (
      <div className='console-results-item'>
        <p className='console-results-item__answer'><strong>Answer</strong> - {answer}</p>
        <p><strong>Guessed By</strong> - {guessed.length ? guessed.join(',') : 'No one'}</p>
        <p><em>{author.join(',')}'s {truth ? 'truth' : 'lie'}</em></p>
      </div>
    );
  }
}

ResultsItem.propTypes = {
  guessed: PropTypes.array,
  author: PropTypes.array,
  answer: PropTypes.string,
  truth: PropTypes.bool
}

export default ResultsItem;

import React, { Component, PropTypes } from 'react';
import ResultsItem from './ResultsItem';

class QuestionResults extends Component {
  constructor(props) {
    super(props);

    const { guessResults } = this.props;
    const resultForView = guessResults.shift();
    this.state = {
      results: guessResults,
      resultForView
    };

    setTimeout(() => this.showNextResult(), 5000);
  }

  render() {
    const { resultForView } = this.state;
    const { guessed, wrote, answer, truth } = resultForView;

    return (
      <ResultsItem
        guessed={guessed}
        author={wrote}
        answer={answer}
        truth={truth}
      />
    );
  }

  showNextResult() {
    const { showPoints } = this.props;
    const { results } = this.state;

    if (results.length) {
      setTimeout(() => this.showNextResult(), 5000);
      const resultForView = results.shift();
      this.setState({ results, resultForView });
    } else {
      showPoints();
    }
  }
}

QuestionResults.propTypes = {
  showPoints: PropTypes.func,
  guessResults: PropTypes.array
}

export default QuestionResults;

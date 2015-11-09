import React, { Component, PropTypes } from 'react';
import PointsItem from './PointsItem';
import QuestionResults from './QuestionResults';
import stateConstants from '../../constants/stateConstants';

class ResultsComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.appState === stateConstants.SHOW_POINTS) {
      this.showNext();
    }
  }

  render() {
    const { question, guessResults, points, actions } = this.props;

    return (
      <div>
        <h2>{question}</h2>
        <p className='console-about'>The results...</p>

        <QuestionResults
          guessResults={guessResults}
          showPoints={actions.getNextResults}
        />

        <br />
        <h3>Points</h3>
        <ul className='console-questions-list'>
          {
            points.map((p, i) => {
              return (
                <PointsItem
                  key={i}
                  playerName={p.player}
                  points={p.points}
                  winner={false}
                />
              );
            })
          }
        </ul>
      </div>
    );
  }

  showNext() {
    const { actions } = this.props;
    setTimeout(() => actions.getNextResults(), 10000);
  }
}

ResultsComponent.propTypes = {
  appState: PropTypes.string,
  question: PropTypes.string,
  guessResults: PropTypes.array,
  points: PropTypes.array,
  actions: PropTypes.object
}

export default ResultsComponent;

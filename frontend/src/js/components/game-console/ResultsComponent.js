import React, { Component, PropTypes } from 'react';

export default class ResultsComponent extends Component {

  static propTypes = {
    appState: PropTypes.string,
    question: PropTypes.string,
    guessResults: PropTypes.array,
    points: PropTypes.array,
    actions: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.showNext();
  }

  componentWillUpdate(nextProps) {
    const { appState } = this.props;
    if (appState !== nextProps.appState) {
      this.showNext();
    }
  }

  render() {
    const { question, guessResults, points } = this.props;

    return (
      <div>
        <h2>{question}</h2>
        <p className='console-about'>The results...</p>
        <ul className='console-questions-list'>
          {
            guessResults.map((result, i) => {
              const guessedBy = result.guessed.join(',');
              const wroteBy = result.wrote.join(',');

              return (
                <li key={i}>
                  <em>Answer</em> - {result.answer}<br />
                  {wroteBy}'s {result.truth ? 'truth' : 'lie'}!<br />
                  <em>Guessed By:</em> - {guessedBy ? guessedBy : 'No One'}
                  <br />
                  <br />
                </li>
              );
            })
          }
        </ul>
        <br />
        <h3>Points</h3>
        <ul className='console-questions-list'>
          {
            points.map((p, i) => {
              return (
                <li><em>{p.player}</em> - {p.points}</li>
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

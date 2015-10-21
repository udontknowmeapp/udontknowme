import React, { Component, PropTypes } from 'react';
import AppActions from '../../actions/AppActions';
import playerTypes from '../../constants/playerTypeConstants';
import states from '../../constants/stateConstants';
import messages from '../../constants/messagesConstants';

export default class ResultsComponent extends Component {

  static propTypes = {
    appState: PropTypes.string,
    conn: PropTypes.object,
    question: PropTypes.string,
    guessResults: PropTypes.array,
    points: PropTypes.array
  }

  constructor(props) {
    super(props);
    AppActions.resetTimer();
    this.showNext();
  }

  componentDidUpdate() {
    this.showNext();
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
    const { appState, conn } = this.props;

    setTimeout(() => conn.send(
      playerTypes.CONSOLE,
      null,
      appState === states.SHOW_RESULTS ? messages.RESULTS_COMPLETE : messages.POINTS_COMPLETE
    ), 15000);
  }
}

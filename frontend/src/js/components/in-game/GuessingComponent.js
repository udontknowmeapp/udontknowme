import indexOf from 'lodash/array/indexOf';
import React, { Component, PropTypes } from 'react';
import GuessingItem from './GuessingItem';
import PlayerActions from '../../actions/PlayerActions';

export default class GuessingComponent extends Component {

  static propTypes = {
    answers: PropTypes.array,
    aboutMe: PropTypes.bool,
    guessSubmitted: PropTypes.bool,
    playerName: PropTypes.string,
    conn: PropTypes.object
  }

  render() {
    const { aboutMe, guessSubmitted, playerName, answers } = this.props;
    const answersForDisplay = answers.filter(answer => {
      return indexOf(answer.players, playerName) === -1;
    });

    return (
      <div className='guessing-page'>
        <div className='guessing-page-content'>
          {
            aboutMe &&
              <p>This one's about you. Hang tight while people vote.</p>
          }
          {
            !aboutMe && !guessSubmitted &&
              <div>
                <h2>The Answers</h2>
                <ul>
                  {answersForDisplay.map(answer => {
                    return (
                      <GuessingItem
                        answer={answer}
                        submitGuess={this.submitGuess.bind(this)}
                      />
                    );
                  })}
                </ul>
              </div>
          }
          {
            !aboutMe && guessSubmitted &&
              <p>Thanks. Hang tight while everyone else submits their answers.</p>
          }
        </div>
      </div>
    );
  }

  submitGuess(answerForGuess) {
    const { playerName, conn } = this.props;
    PlayerActions.submitGuess(playerName, answerForGuess, conn);
  }
}

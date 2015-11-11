import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { setupShallowRender } from '../../helpers';
import ResultsItem from '../../../components/game-console/ResultsItem';

describe('components/game-console/ResultsItem', () => {
  let mockProps = {
    answer: 'Test answer',
    author: ['billy']
  };

  it('should render the component content with a lie', () => {
    mockProps['guessed'] = ['messy', 'kyle'];
    mockProps['truth'] = false;
    const component = setupShallowRender(mockProps, ResultsItem);
    const { answer, author, guessed, truth } = mockProps;

    expect(component).toEqual(
      <div className='console-results-item'>
        <p className='console-results-item__answer'><strong>Answer</strong> - {answer}</p>
        <p><strong>Guessed By</strong> - {guessed.length ? guessed.join(',') : 'No one'}</p>
        <p><em>{author.join(',')}'s {truth ? 'truth' : 'lie'}</em></p>
      </div>
    );
  });

  it('should render the component content with a truth', () => {
    mockProps['guessed'] = ['messy', 'kyle'];
    mockProps['truth'] = true;
    const component = setupShallowRender(mockProps, ResultsItem);
    const { answer, author, guessed, truth } = mockProps;

    expect(component).toEqual(
      <div className='console-results-item'>
        <p className='console-results-item__answer'><strong>Answer</strong> - {answer}</p>
        <p><strong>Guessed By</strong> - {guessed.length ? guessed.join(',') : 'No one'}</p>
        <p><em>{author.join(',')}'s {truth ? 'truth' : 'lie'}</em></p>
      </div>
    );
  });

  it('should render the component with no one guessing the answer', () => {
    mockProps['guessed'] = [];
    mockProps['truth'] = true;
    const component = setupShallowRender(mockProps, ResultsItem);
    const { answer, author, guessed, truth } = mockProps;

    expect(component).toEqual(
      <div className='console-results-item'>
        <p className='console-results-item__answer'><strong>Answer</strong> - {answer}</p>
        <p><strong>Guessed By</strong> - {guessed.length ? guessed.join(',') : 'No one'}</p>
        <p><em>{author.join(',')}'s {truth ? 'truth' : 'lie'}</em></p>
      </div>
    );
  });

  it('should render the component with multiple authors', () => {
    mockProps['guessed'] = ['billy', 'messy'];
    mockProps['truth'] = true;
    mockProps.author.push('kyle');
    const component = setupShallowRender(mockProps, ResultsItem);
    const { answer, author, guessed, truth } = mockProps;

    expect(component).toEqual(
      <div className='console-results-item'>
        <p className='console-results-item__answer'><strong>Answer</strong> - {answer}</p>
        <p><strong>Guessed By</strong> - {guessed.length ? guessed.join(',') : 'No one'}</p>
        <p><em>{author.join(',')}'s {truth ? 'truth' : 'lie'}</em></p>
      </div>
    );
  });
});

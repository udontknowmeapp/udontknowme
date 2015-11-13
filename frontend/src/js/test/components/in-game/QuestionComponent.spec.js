import expect from 'expect';
import React from 'react';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import { setupRender, setupShallowRender } from '../../helpers';
import QuestionComponent from '../../../components/in-game/QuestionComponent';

describe('components/in-game/QuestionComponent', () => {
  const mockProps = {
    question: 'What is life?',
    aboutMe: true,
    questionAbout: 'billy',
    playerName: 'billy',
    answerSubmitted: false,
    actions: {
      submitAnswer: expect.createSpy()
    }
  };

  it('should render with an empty answer in this.state', () => {
    const component = setupRender(mockProps, QuestionComponent);
    expect(component.state.answer).toBe('');
  })

  it('should update the answer in state on input change', () => {
    const component = setupRender(mockProps, QuestionComponent);
    const input = TestUtils.findRenderedDOMComponentWithClass(component, 'question-page-content__input');
    Simulate.change(input, { target: { value: 'billy' }});
    expect(component.state.answer).toBe('billy');
  });

  it('should call submit and the clear state on button click', () => {
    const component = setupRender(mockProps, QuestionComponent);
    const button = TestUtils.findRenderedDOMComponentWithClass(component, 'question-page-content__button');

    Simulate.click(button);
    expect(component.state.answer).toBe('');
    expect(mockProps.actions.submitAnswer.calls.length).toBe(1);
  });
});

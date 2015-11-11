import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { setupShallowRender } from '../../helpers';
import PointsItem from '../../../components/game-console/PointsItem';

describe('components/game-console/PointsItem', () => {
  let mockProps = {
    playerName: 'billy',
    points: 10,
    winner: true
  };

  it('should render the component content', () => {
    const component = setupShallowRender(mockProps, PointsItem);
    const { playerName, points, winner } = mockProps;

    expect(component).toEqual(
      <li>
        <em>{playerName} {winner && '(Winner)'}</em> - {points}
      </li>
    );
  });

  it('should render the component content with winner as false', () => {
    mockProps.winner = false;
    const component = setupShallowRender(mockProps, PointsItem);
    const { playerName, points, winner } = mockProps;

    expect(component).toEqual(
      <li>
        <em>{playerName} {winner && '(Winner)'}</em> - {points}
      </li>
    );
  });
});

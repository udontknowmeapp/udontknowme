import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../app';
import InGameWrapper from '../wrappers/InGameWrapper';
import HomePage from '../pages/HomePage';
import PlayerSignupPage from '../pages/PlayerSignupPage';
import InGamePage from '../pages/InGamePage';
import GameConsolePage from '../pages/GameConsolePage';

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={HomePage} />
    <Route path='/player-signup' component={PlayerSignupPage} />

    <Route component={InGameWrapper}>
      <Route path='/game-console' component={GameConsolePage} />
      <Route path='/in-game' component={InGamePage} />
    </Route>
  </Route>
);

export default routes;

import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from '../app';
import InGameWrapper from '../wrappers/InGameWrapper';
import HomePage from '../pages/HomePage';
import PlayerSignupPage from '../pages/PlayerSignupPage';
import InGamePage from '../pages/InGamePage';
import GameConsolePage from '../pages/GameConsolePage';

let history = createHashHistory();
if (DEPLOY !== 'static') {
  history = createBrowserHistory();
}

const router = (
  <Router history={history}>
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='/player-signup' component={PlayerSignupPage} />

      <Route component={InGameWrapper}>
        <Route path='/game-console' component={GameConsolePage} />
        <Route path='/in-game' component={InGamePage} />
      </Route>
    </Route>
  </Router>
);

export default router;

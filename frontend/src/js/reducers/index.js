import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';
import app from './app';
import player from './player';
import gameConsole from './console';

const rootReducer = combineReducers({
  app,
  player,
  gameConsole,
  router
});

export default rootReducer;

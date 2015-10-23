import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes/routes';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import api from '../middleware/api';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

const finalStore = compose(
  applyMiddleware(thunk, multi, api),
  reduxReactRouter({ routes, createHistory }),
  applyMiddleware(createLogger())
)(createStore);

export default function configureStore(initialState) {
  const store = finalStore(rootReducer, initialState);
  return store;
}

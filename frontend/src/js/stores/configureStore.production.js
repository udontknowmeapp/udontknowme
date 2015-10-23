import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes/routes';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';

const finalStore = compose(
  applyMiddleware(thunk, api),
  reduxReactRouter({ routes, createHistory })
)(createStore);

export default function configureStore(initialState) {
  return finalStore(rootReducer, initialState);
}

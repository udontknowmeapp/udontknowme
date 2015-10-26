import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import configureStore from './stores';

require('../css/app.scss');

const store = configureStore();
ReactDOM.render(<Root store={store} />, document.getElementById('app'));

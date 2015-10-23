import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import configureStore from './stores/configureStore';

require('../css/app.scss');

const store = configureStore();
ReactDOM.render(<App store={store} />, document.getElementById('app'));

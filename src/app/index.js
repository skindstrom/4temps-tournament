// @flow

import React from 'react';
// There's currently no type declaration for hydrate, but it exists
// $FlowFixMe
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import createStore from './redux-store';

const preloadedState: ReduxState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = createStore(preloadedState);

const root = document.getElementById('root');
if (root) {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    root
  );
} else {
  throw new Error('Could not find react root');
}
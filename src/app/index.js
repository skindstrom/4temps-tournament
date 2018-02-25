// @flow

import React from 'react';
// There's currently no type declaration for hydrate, but it exists
// $FlowFixMe
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { setup as setupRealTimeUpdates } from './api/realtime';
import { appWithStore, initializeStore } from './components/App';

const preloadedState: ReduxState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const root = document.getElementById('root');
if (root) {
  const store = initializeStore(preloadedState);

  // $FlowFixMe
  setupRealTimeUpdates(store.dispatch);

  hydrate(<BrowserRouter>{appWithStore(store)}</BrowserRouter>, root);
} else {
  throw new Error('Could not find react root');
}

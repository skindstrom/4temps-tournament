// @flow

import React from 'react';
// There's currently no type declaration for hydrate, but it exists
// $FlowFixMe
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { appWithPreloadedState } from './components/App';

const preloadedState: ReduxState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const root = document.getElementById('root');
if (root) {
  hydrate(
    <BrowserRouter>{appWithPreloadedState(preloadedState)}</BrowserRouter>,
    root
  );
} else {
  throw new Error('Could not find react root');
}

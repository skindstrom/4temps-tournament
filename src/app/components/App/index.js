// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import type { Store } from 'redux';

import Router from '../Router';
import NavigationBar from '../NavigationBar';
import reducer, { initialState } from '../../reducers';

let store: Store<ReduxState, ReduxPackAction>;

export function getReduxState(): ReduxState {
  if (store) {
    return store.getState();
  }
  return initialState();
}

export function appWithPreloadedState(preloadedState: mixed) {
  store = initializeStore(preloadedState);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function initializeStore(preloadedState: mixed) {
  const state = { ...initialState(), ...preloadedState };
  return createStore(reducer, state,
    applyMiddleware(reduxPackMiddleware));
}

function App() {
  return (
    <div>
      <NavigationBar />
      <Router />
    </div>
  );
}

export default App;
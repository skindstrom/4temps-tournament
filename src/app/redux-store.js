// @flow
import { createStore, applyMiddleware } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';

import reducer, { initialState } from './reducers';

export default function (preloadedState: ReduxState) {
  const state = { ...initialState(), ...preloadedState };
  return createStore(reducer, state,
    applyMiddleware(reduxPackMiddleware));
}
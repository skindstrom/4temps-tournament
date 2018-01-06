// @flow
import { createStore, applyMiddleware } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';

import reducer from './reducers';

export default function (preloadedState: ReduxState) {
  return createStore(reducer, preloadedState,
    applyMiddleware(reduxPackMiddleware));
}
// @flow
import { combineReducers } from 'redux';
import type { Reducer } from 'redux';
import { LIFECYCLE } from 'redux-pack';

import isAuthenticated from './is-authenticated';
import uiLogin from './ui-login';
import uiSignUp from './ui-signup';
import tournaments from './tournaments';
import participants from './participants';

import makePackAction from './test-utils';

const reducer: Reducer<ReduxState, ReduxPackAction> =
  combineReducers({
    isAuthenticated,
    uiLogin,
    uiSignUp,
    tournaments,
    participants
  });

export function getInitialState(): ReduxState {
  return reducer(
    // $FlowFixMe
    undefined,
    makePackAction(LIFECYCLE.START, 'INVALID_ACTION'));
}

export default reducer;
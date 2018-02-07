// @flow
import { combineReducers } from 'redux';
import type { Reducer } from 'redux';
import { LIFECYCLE } from 'redux-pack';

import user from './user';
import accessKeys from './access-keys';
import tournaments from './tournaments';
import participants from './participants';
import rounds from './rounds';
import judges from './judges';
import ui from './ui';

import makePackAction from './test-utils';

const reducer: Reducer<ReduxState, ReduxPackAction> =
  combineReducers({
    user,
    accessKeys,
    tournaments,
    participants,
    rounds,
    judges,
    ui
  });

export function getInitialState(): ReduxState {
  return reducer(
    // $FlowFixMe
    undefined,
    makePackAction(LIFECYCLE.START, 'INVALID_ACTION'));
}

export default reducer;

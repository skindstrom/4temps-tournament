// @flow

import {handle} from 'redux-pack';

export default function reducer(
  state: AccessKeysReduxState = getInitialState(),
  action: ReduxPackAction): AccessKeysReduxState {

  const { type, payload } = action;

  switch (type) {
  case 'GET_ACCESS_KEYS':
    return handle(state, action, {
      success: prevState => {
        const byUserId = payload.reduce((acc, curr) => {
          acc[curr.userId] = curr.key;
          return acc;
        }, {});

        return { ...prevState, ...byUserId };
      }
    });
  default:
    return state;
  }
}

export function getInitialState(): AccessKeysReduxState {
  return {};
}
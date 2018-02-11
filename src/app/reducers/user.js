// @flow

import { handle } from 'redux-pack';

function userReducer(
  state: UserReduxState = getInitialState(),
  action: ReduxPackAction
): UserReduxState {
  const { type } = action;

  switch (type) {
  case 'LOGIN_USER':
  case 'LOGIN_WITH_ACCESS_KEY':
    return loginUser(state, action);
  case 'LOGOUT_USER':
    return logoutUser(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UserReduxState {
  return { id: '' };
}

function loginUser(
  state: UserReduxState,
  action: ReduxPackAction
): UserReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: () => ({ id: payload.userId })
  });
}

function logoutUser(
  state: UserReduxState,
  action: ReduxPackAction
): UserReduxState {
  return handle(state, action, {
    success: () => ({ id: '' })
  });
}

export default userReducer;

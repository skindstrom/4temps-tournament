// @flow

import { handle } from 'redux-pack';

function userReducer(
  state: UserReduxState = getInitialState(),
  action: ReduxPackAction
): UserReduxState {
  const { type } = action;

  switch (type) {
  case 'LOGIN_USER':
    return loginUser(state, action);
  case 'LOGIN_WITH_ACCESS_KEY':
    return loginJudge(state, action);
  case 'LOGOUT_USER':
    return logoutUser(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UserReduxState {
  return { id: '', role: '' };
}

function loginUser(
  state: UserReduxState,
  action: ReduxPackAction
): UserReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: () => ({ id: payload.userId, role: 'admin' })
  });
}

function loginJudge(
  state: UserReduxState,
  action: ReduxPackAction
): UserReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: () => ({ id: payload.userId, role: 'judge' })
  });
}

function logoutUser(
  state: UserReduxState,
  action: ReduxPackAction
): UserReduxState {
  return handle(state, action, {
    success: () => ({ id: '', role: '' })
  });
}

export default userReducer;

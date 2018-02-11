// @flow

import { handle } from 'redux-pack';

function uiLogin(
  state: UiJudgeLoginReduxState = getInitialState(),
  action: ReduxPackAction
): UiJudgeLoginReduxState {
  const { type, payload } = action;

  switch (type) {
  case 'LOGIN_WITH_ACCESS_KEY':
    return handle(state, action, {
      start: prevState => ({ ...prevState, isLoading: true }),
      success: () => getInitialState(),
      failure: prevState => ({ ...prevState, isLoading: false, ...payload })
    });
  default:
    return state;
  }
}

export function getInitialState(): UiJudgeLoginReduxState {
  return {
    isLoading: false,
    isValidAccessKey: true,
    doesAccessKeyExist: true
  };
}

export default uiLogin;

// @flow

import { handle } from 'redux-pack';

function uiLogin(state: UiLoginReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type, payload } = action;

  switch (type) {
  case 'LOGIN_USER':
    return handle(state, action, {
      start: prevState => ({ ...prevState, isLoading: true }),
      success: prevState => ({ ...prevState, isLoading: false, ...payload }),
      failure: prevState => ({ ...prevState, isLoading: false, ...payload }),
    });
  default:
    return state;
  }
}

export function getInitialState() {
  return {
    isLoading: false,
    isValid: true,
    isValidEmail: true,
    isValidPassword: true,
    doesUserExist: true
  };
}

export default uiLogin;
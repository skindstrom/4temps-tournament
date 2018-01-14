// @flow

import { handle } from 'redux-pack';

function uiSignUp(state: UiSignUpReduxState = getInitialState(),
  action: ReduxPackAction): UiSignUpReduxState {

  const { type, payload } = action;

  switch (type) {
  case 'SIGNUP':
    return handle(state, action, {
      start: prevState => ({ ...prevState, isLoading: true }),
      success: getInitialState,
      failure: prevState => ({
        ...prevState,
        isLoading: false,
        validation: payload
      })
    });
  default:
    return state;
  }
}

export function getInitialState(): UiSignUpReduxState {
  return {
    isLoading: false,
    validation: {
      isValid: true,
      isEmailNotUsed: true,
      isValidFirstName: true,
      isValidLastName: true,
      isValidEmail: true,
      isValidPassword: true
    }
  };
}

export default uiSignUp;
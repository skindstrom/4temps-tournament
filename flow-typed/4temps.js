// @flow
import type { UserLoginValidationSummary } from
  '../src/validators/validate-user-login';

// Redux
declare type ReduxDispatch = (action: ReduxAction) => any;
declare type ReduxState = {
  isAuthenticated: boolean,
  uiLogin: {
    isLoading: boolean,
    isValid: boolean,
    isValidEmail: boolean,
    isValidPassword: boolean,
    doesUserExist: boolean
  }
};
declare type ReduxAction = LogoutAction | LoginAction;

// Redux Actions
declare type LogoutAction =
  { type: 'LOGOUT_USER', promise: Promise<boolean> };

declare type LoginAction =
  {
    type: 'LOGIN_USER',
    promise: Promise<UserLoginValidationSummary>,
    meta: ?any
  };
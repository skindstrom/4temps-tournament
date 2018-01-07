// @flow
import type { UserLoginValidationSummary } from
  '../src/validators/validate-user-login';
import type { Tournament } from '../src/models/tournament';

// Redux
declare type ReduxDispatch = (action: ReduxAction) => any;
declare type ReduxState = {
  isAuthenticated: boolean,
  tournaments: {
    isLoading: boolean,

    allIds: [],
    byId: {
      [id: string]: Tournament
    }
  },

  uiLogin: {
    isLoading: boolean,
    isValid: boolean,
    isValidEmail: boolean,
    isValidPassword: boolean,
    doesUserExist: boolean
  }
};
declare type ReduxAction = LogoutAction | LoginAction
  | GetAllTournamentsAction;

// Redux Actions
declare type LogoutAction =
  { type: 'LOGOUT_USER', promise: Promise<boolean> };

declare type LoginAction =
  {
    type: 'LOGIN_USER',
    promise: Promise<UserLoginValidationSummary>,
    meta: ?any
  };

declare type GetAllTournamentsAction =
  { type: 'GET_ALL_TOURNAMENTS', promise: Promise<Array<Tournament>> };
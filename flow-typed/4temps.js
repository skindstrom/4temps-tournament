// @flow
import type { UserLoginValidationSummary } from
  '../src/validators/validate-user-login';
import type{ Tournament } from '../src/models/tournament';
import type { TournamentValidationSummary } from
  '../src/validators/validate-tournament';

// Redux
declare type ReduxDispatch = (action: ReduxAction) => any;
declare type ReduxState = {
  isAuthenticated: boolean,
  tournaments: {
    isLoading: boolean,

    forUser: Array<string>,
    allIds: Array<string>,
    byId: {
      [id: string]: Tournament
    },

    uiCreateTournament: {
      isLoading: boolean,
      validation: TournamentValidationSummary
    }
  },

  uiLogin: {
    isLoading: boolean,
    isValid: boolean,
    isValidEmail: boolean,
    isValidPassword: boolean,
    doesUserExist: boolean
  },
};
declare type ReduxAction = LogoutAction | LoginAction
  | GetAllTournamentsAction | GetUserTournamentsAction | CreateTournamentAction;

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

declare type GetUserTournamentsAction =
  { type: 'GET_USER_TOURNAMENTS', promise: Promise<Array<Tournament>> };

declare type CreateTournamentAction =
  {
    type: 'CREATE_TOURNAMENT',
    promise: Promise<TournamentValidationSummary>,
    meta: any
  };
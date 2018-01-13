// @flow
import type { UserLoginValidationSummary } from
  '../src/validators/validate-user-login';
import type{ Tournament } from '../src/models/tournament';
import type { TournamentValidationSummary } from
  '../src/validators/validate-tournament';
import type { Participant } from '../src/models/participant';
import type { ParticipantValidationSummary } from
  '../src/validators/validate-participant';
import type { UserCreateValidationSummary } from
  '../src/validators/validate-user';

// Redux
declare type ReduxDispatch = (action: ReduxAction) => mixed;
declare type ReduxState = {
  isAuthenticated: boolean,
  tournaments: {
    isLoading: boolean,
    isInvalidated: boolean,
    didLoadUserTournaments: boolean,

    forUser: Array<string>,
    allIds: Array<string>,
    byId: {
      [id: string]: Tournament
    },

    uiCreateTournament: {
      isLoading: boolean,
      validation: TournamentValidationSummary
    },
    uiEditTournament: {
      isValidName: boolean,
      isValidDate: boolean
    }
  },
  participants: {
    isLoading: boolean,

    forTournament: {
      [id: string]: Array<string>
    },
    byId: {
      [id: string]: Participant
    },
    uiCreateParticipant: {
      isLoading: boolean,
      createdSuccessfully: boolean,
      validation: ParticipantValidationSummary
    }
  },

  uiLogin: UiLoginReduxState,
  uiSignUp: {
    isLoading: boolean,
    validation: UserCreateValidationSummary
  }
};

declare type UiLoginReduxState = {
  isLoading: boolean,
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesUserExist: boolean
}

declare type ReduxPackAction = {
  type: string,
  payload: any
}

declare type ReduxAction = LogoutAction | LoginAction
  | GetAllTournamentsAction | GetUserTournamentsAction
  | CreateTournamentAction | EditTournamentAction
  | GetParticipantsAction | CreateParticipantAction
  | SignUpAction;

// Redux Actions
declare type LogoutAction =
  {
    type: 'LOGOUT_USER',
    promise: Promise<boolean>,
    meta: {
      onSuccess: () => mixed
    }
  };

declare type LoginAction =
  {
    type: 'LOGIN_USER',
    promise: Promise<UserLoginValidationSummary>,
    meta: {
      onSuccess: () => mixed
    }
  };

declare type GetAllTournamentsAction =
  { type: 'GET_ALL_TOURNAMENTS', promise: Promise<Array<Tournament>> };

declare type GetUserTournamentsAction =
  { type: 'GET_USER_TOURNAMENTS', promise: Promise<Array<Tournament>> };

declare type CreateTournamentAction =
  {
    type: 'CREATE_TOURNAMENT',
    promise: Promise<Tournament>,
    meta: {
      onSuccess: (tournament: Tournament) => mixed
    }
  };
declare type EditTournamentAction =
  { type: 'EDIT_TOURNAMENT', promise: Promise<Tournament>};

declare type GetParticipantsAction =
  {
    type: 'GET_PARTICIPANTS',
    promise: Promise<{ tournamentId: string, participants: Array<Participant> }>
  };

declare type CreateParticipantAction =
  {
    type: 'CREATE_PARTICIPANT',
    promise: Promise<{ tournamentId: string, participant: Participant }>
  };

declare type SignUpAction =
  {
    type: 'SIGNUP',
    promise: Promise<UserCreateValidationSummary>,
    meta: {
      onSuccess: () => mixed
    }
  };
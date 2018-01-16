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


// Base types


type RoundCriterion = {
  name: string,
  minValue: ?number,
  maxValue: ?number,
  description: string,
  type: 'none' | 'both' | 'one' | 'follower' | 'leader'
}

declare type Round = {
  _id: string,
  danceCount: ?number,
  minPairCount: ?number,
  maxPairCount: ?number,
  tieRule: 'none' | 'random' | 'all',
  roundScoringRule: 'none' | 'average' | 'averageWithoutOutliers',
  multipleDanceScoringRule: 'none' | 'average' | 'best' | 'worst',
  criteria: Array<RoundCriterion>
}

// Validation types
declare type RoundValidationSummary = {
  isValidRound: boolean,
  isValidDanceCount: boolean,
  isValidMinPairCount: boolean,
  isValidMaxPairCount: boolean,
  isMaxPairGreaterOrEqualToMinPair: boolean,
  isValidTieRule: boolean,
  isValidRoundScoringRule: boolean,
  isValidMultipleDanceScoringRule: boolean,
  isValidAmountOfCriteria: boolean,
  isValidCriteria: boolean,
  criteriaValidation: Array<{
    isValidCriterion: boolean,
    isValidName: boolean,
    isValidMinValue: boolean,
    isValidMaxValue: boolean,
    isValidValueCombination: boolean,
    isValidType: boolean,
    isValidDescription: boolean
  }>
}


// Redux
declare type ReduxDispatch = (action: ReduxAction) => mixed;
declare type ReduxState = {
  isAuthenticated: boolean,
  tournaments: TournamentReduxState,
  participants: ParticipantReduxState,

  ui: {
    login: UiLoginReduxState,
    signUp: UiSignUpReduxState,

    createTournament: UiCreateTournamentReduxState,
    editTournament: UiEditTournamentReduxState,

    createParticipant: UiCreateParticipantReduxState,
  }
};

declare type UiLoginReduxState = {
  isLoading: boolean,
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesUserExist: boolean
}

declare type UiSignUpReduxState = {
  isLoading: boolean,
  validation: UserCreateValidationSummary
}

declare type TournamentReduxState = {
  isLoading: boolean,
  isInvalidated: boolean,
  didLoadUserTournaments: boolean,

  forUser: Array<string>,
  allIds: Array<string>,
  byId: {
    [id: string]: Tournament
  },
}

declare type UiCreateTournamentReduxState = {
  isLoading: boolean,
  validation: TournamentValidationSummary
}

declare type UiEditTournamentReduxState = {
  isValidName: boolean,
  isValidDate: boolean
}

declare type ParticipantReduxState = {
  isLoading: boolean,

  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Participant
  },
}

declare type UiCreateParticipantReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: ParticipantValidationSummary
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
  { type: 'EDIT_TOURNAMENT', promise: Promise<Tournament> };

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
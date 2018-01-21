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
import type { RoundDbModel } from '../src/data/round';
import type { UserModel } from '../src/data/user';


// Base types


declare type RoundCriterion = {
  name: string,
  minValue: ?number,
  maxValue: ?number,
  description: string,
  type: 'none' | 'both' | 'one' | 'follower' | 'leader'
}

declare type Round = {
  _id: string,
  name: string,
  danceCount: ?number,
  minPairCount: ?number,
  maxPairCount: ?number,
  tieRule: 'none' | 'random' | 'all',
  roundScoringRule: 'none' | 'average' | 'averageWithoutOutliers',
  multipleDanceScoringRule: 'none' | 'average' | 'best' | 'worst',
  criteria: Array<RoundCriterion>
}

// Express interface
declare interface ServerApiRequest {
  session: { user: UserModel };
  body: { [string]: mixed };
  query: { [name: string]: string };
}

declare interface ServerApiResponse {
  sendStatus(statusCode: number): ServerApiResponse;
  json(body?: mixed): ServerApiResponse;
}

// Validation types
declare type RoundValidationSummary = {
  isValidRound: boolean,
  isValidName: boolean,
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
  tournaments: TournamentsReduxState,
  participants: ParticipantsReduxState,
  rounds: RoundsReduxState,

  ui: {
    login: UiLoginReduxState,
    signUp: UiSignUpReduxState,

    createTournament: UiCreateTournamentsReduxState,
    editTournament: UiEditTournamentsReduxState,

    createParticipant: UiCreateParticipantsReduxState,
    createRound: UiCreateRoundReduxState
  }
};

declare type TournamentsReduxState = {
  isLoading: boolean,
  isInvalidated: boolean,
  didLoadUserTournaments: boolean,

  forUser: Array<string>,
  allIds: Array<string>,
  byId: {
    [id: string]: Tournament
  },
}

declare type ParticipantsReduxState = {
  isLoading: boolean,

  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Participant
  },
}

declare type RoundsReduxState = {
  isLoading: boolean,
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Round
  }
}

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

declare type UiCreateTournamentsReduxState = {
  isLoading: boolean,
  validation: TournamentValidationSummary
}

declare type UiEditTournamentsReduxState = {
  isValidName: boolean,
  isValidDate: boolean
}

declare type UiCreateParticipantsReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: ParticipantValidationSummary
}

declare type UiCreateRoundReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: RoundValidationSummary
}

declare type ReduxPackAction = {
  type: string,
  payload: any
}

declare type ReduxAction = LogoutAction | LoginAction
  | GetAllTournamentsAction | GetUserTournamentsAction
  | CreateTournamentAction | EditTournamentAction
  | GetParticipantsAction | CreateParticipantAction
  | SignUpAction | CreateRoundAction | GetRoundsAction;

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

declare type CreateRoundAction =
  {
    type: 'CREATE_ROUND',
    promise: Promise<RoundDbModel>
  }

declare type GetRoundsAction =
  {
    type: 'GET_ROUNDS',
    promise: Promise<{ tournamentId: string, rounds: Array<RoundDbModel> }>
  }
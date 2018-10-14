// @flow
import type Moment from 'moment';
import type { AdminLoginValidationSummary } from '../src/validators/validate-admin-login';
import type { TournamentValidationSummary } from '../src/validators/validate-tournament';
import type { ParticipantValidationSummary } from '../src/validators/validate-participant';
import type { AdminCreateValidationSummary } from '../src/validators/validate-admin';

// Base types

declare type TournamentType = 'none' | 'jj' | 'classic';

declare type Tournament = {
  id: string,
  creatorId: string,
  name: string,
  date: Moment,
  type: TournamentType,
  dancesNoted: { [judgeId: string]: Array<string> },
  judges: Array<Judge>,
  assistants: Array<Assistant>,
  participants: Array<Participant>,
  rounds: Array<Round>
};

declare type ParticipantRole =
  | 'none'
  | 'leader'
  | 'follower'
  | 'leaderAndFollower';

declare type Participant = {
  id: string,
  attendanceId: number,
  name: string,
  role: ParticipantRole,
  isAttending: boolean
};

declare type RoundCriterion = {
  id: string,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  forJudgeType: JudgeType
};

declare type Round = {
  id: string,
  name: string,
  danceCount: number,
  minPairCountPerGroup: number,
  maxPairCountPerGroup: number,
  passingCouplesCount: number,
  multipleDanceScoringRule: 'none' | 'average' | 'best',
  criteria: Array<RoundCriterion>,
  active: boolean,
  finished: boolean,
  draw: boolean,
  groups: Array<DanceGroup>,
  roundScores: Array<Score>
};

declare type Score = {
  participantId: string,
  score: number
};

declare type DanceGroup = {
  id: string,
  pairs: Array<Pair>,
  dances: Array<Dance>
};

declare type Dance = {
  id: string,
  active: boolean,
  finished: boolean
};

declare type Pair = {
  follower: ?string,
  leader: ?string
};

declare type AccessKey = {
  userId: string,
  tournamentId: string,
  key: string,
  role: 'judge' | 'assistant'
};

declare type JudgeType = 'normal' | 'sanctioner' | 'president';

declare type Judge = {
  id: string,
  name: string,
  judgeType: JudgeType
};

declare type JudgeNote = {
  judgeId: string,
  danceId: string,
  criterionId: string,
  participantId: string,
  value: number
};

declare type Admin = {
  firstName: string,
  lastName: string,
  email: string
};

declare type AdminWithPassword = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
};

declare type AdminCredentials = {
  email: string,
  password: string
};

declare type User = { id: string, role: PermissionRole };

declare type PermissionRole =
  | 'public'
  | 'admin'
  | 'authenticated'
  | 'judge'
  | 'assistant';

declare type Assistant = { id: string, name: string };

declare type Leaderboard = {
  tournamentId: string,
  rounds: Array<LeaderboardRound>,
  remainingParticipants: Array<Participant>,
  tournamentName: string
};

declare type LeaderboardRound = {
  roundId: string,
  name: string,
  isFinished: boolean,
  winningLeaderScores: Array<LeaderboardScore>,
  winningFollowerScores: Array<LeaderboardScore>,
  losingLeaderScores: Array<LeaderboardScore>,
  losingFollowerScores: Array<LeaderboardScore>
};

declare type LeaderboardScore = {
  id: string,
  attendanceId: number,
  position: number,
  score: number
};

// Express interface
declare interface ServerApiRequest {
  session: { user: ?User };
  body: mixed;
  query: { [name: string]: string };
  params: { [param: string]: string };
}

declare interface ServerApiResponse {
  status(statusCode: number): ServerApiResponse;
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
  isValidPassingCouplesCount: boolean,
  isMaxPairGreaterOrEqualToMinPair: boolean,
  isValidMultipleDanceScoringRule: boolean,
  isValidAmountOfCriteria: boolean,
  isValidCriteria: boolean,
  criteriaValidation: Array<{
    isValidCriterion: boolean,
    isValidName: boolean,
    isValidMinValue: boolean,
    isValidMaxValue: boolean,
    isValidValueCombination: boolean,
    isValidDescription: boolean
  }>
};

// Redux
declare type ReduxDispatch = (action: ReduxAction) => mixed;
declare type ReduxState = {
  user: UserReduxState,
  tournaments: TournamentsReduxState,
  participants: ParticipantsReduxState,
  rounds: RoundsReduxState,
  judges: JudgesReduxState,
  assistants: AssistantsReduxState,

  accessKeys: AccessKeysReduxState,
  notes: NotesReduxState,
  leaderboards: LeaderboardsReduxState,

  ui: {
    judgeLogin: UiJudgeLoginReduxState,
    login: UiLoginReduxState,
    signUp: UiSignUpReduxState,

    createTournament: UiCreateTournamentsReduxState,
    editTournament: UiEditTournamentsReduxState,

    createParticipant: UiCreateParticipantsReduxState,
    createRound: UiCreateRoundReduxState,
    createJudge: UiCreateJudgeReduxState,
    createAssistant: UiCreateAssistantReduxState,

    notes: UiNotesReduxState
  }
};

declare type UserReduxState = {
  id: string,
  role: '' | 'admin' | 'judge' | 'assistant',
  tournamentId: string // only set for judge and assistant
};

declare type TournamentsReduxState = {
  isLoading: boolean,
  isInvalidated: boolean,
  didLoadAdminTournaments: boolean,

  forAdmin: Array<string>,
  allIds: Array<string>,
  forJudge: string,
  byId: {
    [id: string]: {
      id: string,
      creatorId: string,
      name: string,
      date: Moment,
      type: TournamentType,
      judges: Array<string>,
      participants: Array<string>,
      rounds: Array<string>,
      dancesNoted: { [judgeId: string]: Array<string> }
    }
  }
};

declare type ParticipantsReduxState = {
  isLoading: boolean,

  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Participant
  }
};

declare type RoundsReduxState = {
  isLoading: boolean,
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Round
  }
};

declare type JudgesReduxState = {
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Judge
  }
};

declare type AssistantsReduxState = {
  forTournament: {
    [id: string]: Array<string>
  },
  byId: {
    [id: string]: Assistant
  }
};

declare type AccessKeysReduxState = {
  [id: string]: AccessKey
};

declare type NotesReduxState = {
  isLoading: boolean,
  didLoad: boolean,
  byParticipant: {
    [participantId: string]: { [criterionId: string]: JudgeNote }
  }
};

declare type LeaderboardsReduxState = {
  byId: { [tournamentId: string]: Leaderboard }
};

declare type UiLoginReduxState = {
  isLoading: boolean,
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesAdminExist: boolean
};

declare type UiJudgeLoginReduxState = {
  isLoading: boolean,
  isValidAccessKey: boolean,
  doesAccessKeyExist: boolean
};

declare type UiSignUpReduxState = {
  isLoading: boolean,
  validation: AdminCreateValidationSummary
};

declare type UiCreateTournamentsReduxState = {
  isLoading: boolean,
  validation: TournamentValidationSummary
};

declare type UiEditTournamentsReduxState = {
  isValidName: boolean,
  isValidDate: boolean
};

declare type UiCreateParticipantsReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: ParticipantValidationSummary
};

declare type UiCreateRoundReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: RoundValidationSummary
};

declare type UiCreateJudgeReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  isValid: boolean
};

declare type UiCreateAssistantReduxState = {
  isLoading: boolean,
  createdSuccessfully: boolean,
  isValid: boolean
};

declare type UiNotesReduxState = {
  selectedPair: ?string,
  isLoading: boolean,
  didSubmit: boolean,
  successfulSubmit: boolean
};

declare type ReduxPackAction = {
  type: string,
  payload: any
};

declare type ReduxAction =
  | LogoutAction
  | LoginAction
  | GetAllTournamentsAction
  | GetAdminTournamentsAction
  | TournamentUpdatedAction
  | CreateTournamentAction
  | EditTournamentAction
  | CreateParticipantAction
  | SignUpAction
  | CreateRoundAction
  | DeleteRoundAction
  | CreateJudgeAction
  | StartRoundAction
  | LoginJudgeAction
  | GetAccessKeys
  | StartNextDanceAction
  | EndDanceAction
  | ChangeAttendance
  | GetJudgeTournament
  | GetSingleTournament
  | GenerateGroupsAction
  | GetNotesAction
  | SetNoteAction
  | SelectPairAction
  | GetLeaderboardAction
  | CreateAssistantAction
  | SettleDrawAction;

// Redux Actions
declare type LogoutAction = {
  type: 'LOGOUT_USER',
  promise: Promise<boolean>,
  meta: {
    onSuccess: () => mixed
  }
};

declare type LoginAction = {
  type: 'LOGIN_USER',
  promise: Promise<AdminLoginValidationSummary>,
  meta: {
    onSuccess: () => mixed
  }
};

declare type GetAllTournamentsAction = {
  type: 'GET_ALL_TOURNAMENTS',
  promise: Promise<mixed>
};

declare type GetAdminTournamentsAction = {
  type: 'GET_ADMIN_TOURNAMENTS',
  promise: Promise<mixed>
};

declare type TournamentUpdatedAction = {
  type: 'TOURNAMENT_UPDATED',
  payload: mixed
};

declare type CreateTournamentAction = {
  type: 'CREATE_TOURNAMENT',
  promise: Promise<Tournament>,
  meta: {
    onSuccess: (tournament: Tournament) => mixed
  }
};
declare type EditTournamentAction = {
  type: 'EDIT_TOURNAMENT',
  promise: Promise<Tournament>
};

declare type CreateParticipantAction = {
  type: 'CREATE_PARTICIPANT',
  promise: Promise<{ tournamentId: string, participant: Participant }>
};

declare type SignUpAction = {
  type: 'SIGNUP',
  promise: Promise<AdminCreateValidationSummary>,
  meta: {
    onSuccess: () => mixed
  }
};

declare type CreateRoundAction = {
  type: 'CREATE_ROUND',
  promise: Promise<Round>
};

declare type DeleteRoundAction = {
  type: 'DELETE_ROUND',
  promise: Promise<{ tournamentId: string, roundId: string }>
};

declare type CreateJudgeAction = {
  type: 'CREATE_JUDGE',
  promise: Promise<mixed>
};

declare type CreateAssistantAction = {
  type: 'CREATE_ASSISTANT',
  promise: Promise<mixed>
};

declare type StartRoundAction = {
  type: 'START_ROUND',
  promise: Promise<mixed>
};
declare type LoginJudgeAction = {
  type: 'LOGIN_WITH_ACCESS_KEY',
  promise: mixed
};

declare type GetAccessKeys = {
  type: 'GET_ACCESS_KEYS',
  promise: mixed
};

declare type StartNextDanceAction = {
  type: 'START_NEXT_DANCE',
  promise: mixed
};

declare type ChangeAttendance = {
  type: 'CHANGE_ATTENDANCE',
  promise: mixed
};

declare type GetJudgeTournament = {
  type: 'GET_JUDGE_TOURNAMENT',
  promise: mixed
};

declare type GetSingleTournament = {
  type: 'GET_SINGLE_TOURNAMENT',
  promise: mixed
};

declare type GenerateGroupsAction = {
  type: 'GENERATE_GROUPS',
  promise: mixed
};

declare type EndDanceAction = {
  type: 'END_DANCE',
  promise: mixed
};

declare type GetNotesAction = {
  type: 'GET_NOTES',
  promise: mixed
};

declare type SetNoteAction = {
  type: 'SET_NOTE',
  promise: mixed
};

declare type SelectPairAction = {
  type: 'SELECT_PAIR',
  payload: string
};

declare type GetLeaderboardAction = {
  type: 'GET_LEADERBOARD',
  promise: mixed
};

declare type SettleDrawAction = {
  type: 'SETTLE_DRAW',
  promise: mixed
};

// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';
import type {
  UserModel
} from './data/user';
import type {
  TournamentRepository
} from './data/tournament';

export const USER_ID = generateId();
export const TOURNAMENT_ID = generateId();

type Body = {
    [name: string]: mixed
};
type Query = {
    [name: string]: string
};
type Params = Query;

export class Request implements ServerApiRequest {
    body: Body = {};
    session: {
        user: UserModel
    };
    query: Query = {};
    params: Params = {};

    constructor(user: UserModel) {
      this.session = {
        user
      };
    }

    static withBody(body: Body) {
      return Request.withUserAndBody(createUser(), body);
    }

    static withUserAndBody(user: UserModel, body: Body) {
      const req = new Request(user);
      req.body = body;
      return req;
    }

    static withQuery(query: Query) {
      return Request.withUserAndQuery(createUser(), query);
    }

    static withUserAndQuery(user: UserModel, query: Query) {
      const req = new Request(user);
      req.query = query;
      return req;
    }

    static withParams(params: Params) {
      return Request.withUserAndParams(createUser(), params);
    }

    static withUserAndParams(user: UserModel, params: Params) {
      const req = new Request(user);
      req.params = params;
      return req;
    }
}

export class Response implements ServerApiResponse {
  _status: number;
  _body: ? mixed;

  getStatus() {
    return this._status;
  }

  getBody() {
    return this._body;
  }

  status(statusCode: number): ServerApiResponse {
    this._status = statusCode;
    return this;
  }

  sendStatus(statusCode: number): ServerApiResponse {
    this._status = statusCode;
    return this;
  }

  json(body ?: mixed): ServerApiResponse {
    this._status = 200;
    this._body = body;
    return this;
  }
}

export class TournamentRepositoryImpl implements TournamentRepository {
  _tournaments: {[string]: Tournament} = {};

  get = async (id: string) => {
    return this._tournaments[id] || null;
  }

  getAll = async () => {
    return Object.keys(this._tournaments).map(key => this._tournaments[key]);
  }

  getForUser = async (userId: string) => {
    return (await this.getAll()).filter(({creatorId}) => creatorId === userId);
  }

  create = async (tournament: Tournament) => {
    this._tournaments[tournament._id] = tournament;
  }

  update = async (tournament: Tournament) => {
    this._tournaments[tournament._id] = tournament;
  }

  createParticipant =
    async (tournamentId: string, participant: Participant) => {
      this._tournaments[tournamentId].participants.push(participant);
    }

  createRound =
    async (tournamentId: string, round: Round) => {
      this._tournaments[tournamentId].rounds.push(round);
    }

  deleteRound =
    async (tournamentId: string, roundId: string) => {
      this._tournaments[tournamentId].rounds =
        this._tournaments[tournamentId].rounds
          .filter(({_id}) => _id !== roundId);
    }
}

export function createUser(): UserModel {
  return {
    _id: USER_ID,
    email: 'test@gmail.com',
    firstName: 'john',
    lastName: 'smith',
    password: 'password',
  };
}

export function generateId() {
  return ObjectId.generate();
}

export function createRound(): Round {
  return {
    _id: '',
    name: 'name',
    danceCount: 1,
    minPairCount: 1,
    maxPairCount: 2,
    tieRule: 'random',
    roundScoringRule: 'average',
    multipleDanceScoringRule: 'worst',
    criteria: [{
      name: 'style',
      minValue: 1,
      maxValue: 2,
      description: 'style...',
      type: 'one'
    }]
  };
}

export function createTournament(): Tournament {
  return {
    _id: TOURNAMENT_ID.toString(),
    creatorId: USER_ID.toString(),
    name: 'name',
    date: moment(),
    type: 'jj',
    judges: [],
    participants: [],
    rounds: []
  };
}

export function createParticipant(): Participant {
  return {
    _id: generateId().toString(),
    name: 'John Smith',
    role: 'both'
  };
}

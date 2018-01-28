// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';
import {
  mapToDomainModel
} from '../data/tournament';
import type {
  UserModel
} from '../data/user';
import type {
  RoundRepository
} from '../data/round';
import type {
  TournamentModel,
  TournamentRepository
} from '../data/tournament';
import type {
  ParticipantRepository,
  ParticipantDbModel
} from '../data/participant';

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

export class RoundRepositoryImpl implements RoundRepository {
  _rounds: {[id: string]: Array<Round>} = {};

  create = async (tournamentId: string, round: Round) => {
    if (this._rounds[tournamentId] === undefined) {
      this._rounds[tournamentId] = [round];
    } else {
      this._rounds[tournamentId].push(round);
    }
  }

  getForTournament = async (id: string) => {
    return this._rounds[id] == undefined ? [] : this._rounds[id];
  }

  update = async (id: string, rounds: Array<Round>) => {
    this._rounds[id] = rounds;
  }

  delete = async (tournamentId: string, roundId: string) => {
    this._rounds[tournamentId] =
      this._rounds[tournamentId].filter(({_id}) => _id != roundId);
  }
}

export class TournamentRepositoryImpl implements TournamentRepository {
    tournaments: {
        [id: string]: TournamentModel
    } = {};

    get = async(id: string): Promise<?Tournament> => {
      const tournament = this.tournaments[id];
      if (tournament != null) {
        return mapToDomainModel(tournament);
      }
      return null;
    }

    create = (tournament: TournamentModel) => {
      this.tournaments[tournament._id.toString()] = tournament;
    }
}

export class ParticipantRepositoryImpl implements ParticipantRepository {
  participants: Array<ParticipantDbModel> = [];

  createForTournament =
    async (tournamentId: string, participant: Participant) => {
      this.participants.push({tournamentId, ...participant});
    }

  getForTournament = async (tournamentId: string) => {
    return this.participants.filter(
      p => p.tournamentId.toString() == tournamentId);
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
    judges: []
  };
}

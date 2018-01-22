// @flow

import ObjectId from 'bson-objectid';
import type { UserModel } from '../../data/user';
import type { RoundRepository } from '../../data/round';
import type { TournamentModel, TournamentRepository } from
  '../../data/tournament';

export const USER_ID = generateId();
export const TOURNAMENT_ID = generateId();

type Body = { [name: string]: mixed };
type Query = { [name: string]: string };

export class Request implements ServerApiRequest {
  body: Body;
  session: { user: UserModel };
  query: Query;

  constructor(user: UserModel, body: Body, query: Query) {
    this.session = { user };
    this.body = body;
    this.query = query;
  }

  static withBody(body: Body) {
    return Request.withUserAndBody(createUser(), body);
  }

  static withUserAndBody(user: UserModel, body: Body) {
    return new Request(user, body, {});
  }

  static withQuery(query: Query) {
    return Request.withUserAndQuery(createUser(), query);
  }

  static withUserAndQuery(user: UserModel, query: Query) {
    return new Request(user, {}, query);
  }
}

export class Response implements ServerApiResponse {
  status: number;
  body: ?mixed;

  sendStatus(statusCode: number): ServerApiResponse {
    this.status = statusCode;
    return this;
  }

  json(body?: mixed): ServerApiResponse {
    this.status = 200;
    this.body = body;
    return this;
  }
}

export class RoundRepositoryImpl implements RoundRepository {
  _rounds: Array<RoundDbModel> = [];

  create = async (round: RoundDbModel) => {
    this._rounds.push(round);
  }

  getForTournament = async (id: string) => {
    return this._rounds.filter(({ tournamentId }) =>
      tournamentId.toString() == id);
  }
}

export class TournamentRepositoryImpl implements TournamentRepository {
  tournaments: { [id: string]: TournamentModel } = {};
  async get(id: string): Promise<?TournamentModel> {
    return this.tournaments[id] || null;
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

export function createRound(): { [string]: mixed } {
  return {
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

export function createTournament() {
  return {
    _id: TOURNAMENT_ID,
    userId: USER_ID,
    name: 'name',
    date: new Date(),
    type: 'jj'
  };
}
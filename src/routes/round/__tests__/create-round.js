// @flow

import ObjectID from 'bson-objectid';
import { CreateRoundRoute } from '../create-round';
import type { ApiRequest, ApiResponse} from '../create-round';
import type { RoundRepository, RoundDbModel } from '../../../data/round';
import type { UserModel } from '../../../data/user';
import type { TournamentModel, TournamentRepository } from
  '../../../data/tournament';

const USER_ID = ObjectID.generate();
const TOURNAMENT_ID = ObjectID.generate();

class Request implements ApiRequest {
  body: { [string]: mixed };
  session: { user: UserModel };

  constructor(user: UserModel, body: {[string]: mixed}) {
    this.session = { user };
    this.body = body;
  }

  static withUserAndBody(user: UserModel, body: { [string]: mixed }) {
    return new Request(user, body);
  }

  static withBody(body: { [string]: mixed }) {
    return new Request(createUser(), body);
  }
}

class Response implements ApiResponse {
  status: number;
  body: ?mixed;

  sendStatus(statusCode: number): ApiResponse {
    this.status = statusCode;
    return this;
  }

  json(body?: mixed): ApiResponse {
    this.status = 200;
    this.body = body;
    return this;
  }
}

class RoundRepositoryDummy implements RoundRepository {
  _rounds: Array<RoundDbModel> = [];

  create = async (round: RoundDbModel) => {
    this._rounds.push(round);
  }

  getForTournament = async (id: string) => {
    return this._rounds.filter(({ tournamentId }) =>
      tournamentId.toString() == id);
  }
}

class TournamentRepositoryDummy implements TournamentRepository {
  tournaments: { [id: string]: TournamentModel } = {};
  async get(id: string): Promise<?TournamentModel> {
    return this.tournaments[id];
  }
}

function createValidRound(): { [string]: mixed } {
  return {
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

function createUser(): UserModel {
  return {
    _id: USER_ID,
    email: 'test@gmail.com',
    firstName: 'john',
    lastName: 'smith',
    password: 'password',
  };
}

function createRoute(roundRepo: RoundRepository = new RoundRepositoryDummy(),
  tournamentRepo: ?TournamentRepository) {
  if (!tournamentRepo) {
    tournamentRepo = createTournamentRepositoryWithDefaultTournament();
  }
  return new CreateRoundRoute(roundRepo, tournamentRepo);
}

function createTournamentRepositoryWithDefaultTournament() {
  const tournamentRepo = new TournamentRepositoryDummy();
  tournamentRepo.tournaments[TOURNAMENT_ID.toString()] = {
    _id: TOURNAMENT_ID,
    userId: USER_ID,
    name: 'tour',
    date: new Date(),
    type: 'jj'
  };
  return tournamentRepo;
}

function requestWithRound(round: mixed): Request {
  return Request.withBody({
    tournamentId: TOURNAMENT_ID.toString(),
    round: round
  });
}

describe('/api/round/create route', () => {
  test('Empty body returns status 400', async () => {
    const response = new Response();
    const route = createRoute();

    await route.route(requestWithRound({}), response);

    expect(response.status).toBe(400);
  });

  test('Invalid round returns status 400', async () => {
    const response = new Response();
    const route = createRoute();

    await route.route(requestWithRound({
      _id: '',
      danceCount: undefined,
      minPairCount: 1,
      maxPairCount: 2,
      tieRule: 'random',
      roundScoringRule: 'average',
      multipleDanceScoringRule: 'worst',
      criteria: undefined
    }), response);

    expect(response.status).toBe(400);
  });

  test('Valid round returns status 200', async () => {
    const route = createRoute();
    const response = new Response();

    await route.route(requestWithRound(createValidRound()), response);

    expect(response.status).toBe(200);
  });

  test('An invalid round does not cause a round to be created', async () => {
    const repository = new RoundRepositoryDummy();
    const route = createRoute(repository);

    await route.route(requestWithRound({
      tournamentId: '',
      round: {}
    }), new Response());

    expect(repository._rounds).toHaveLength(0);
  });

  test('A valid round gets added to the repository', async () => {
    const repository = new RoundRepositoryDummy();
    const route = createRoute(repository);

    const round = createValidRound();
    await route.route(requestWithRound(round), new Response());

    expect(repository._rounds[0]).toMatchObject(round);
  });

  test('A valid round has an ID generated', async () => {
    const repository = new RoundRepositoryDummy();
    const route = createRoute(repository);

    const round = createValidRound();
    await route.route(requestWithRound(round), new Response());

    expect(repository._rounds[0]._id.length).toBeGreaterThan(0);
  });

  test('A round tracks the tournament it belongs to', async () => {
    const repository = new RoundRepositoryDummy();
    const route = createRoute(repository);

    await route.route(requestWithRound(createValidRound()), new Response());

    expect(repository._rounds[0].tournamentId).toEqual(TOURNAMENT_ID);
  });

  test('Error during creation returns status 500', async () => {
    class ThrowingRepository extends RoundRepositoryDummy {
      create = () => {
        throw {};
      }
    }
    const route = createRoute(new ThrowingRepository());
    const response = new Response();

    await route.route(requestWithRound(createValidRound()), response);

    expect(response.status).toBe(500);
  });

  test('Returns status 401 if user does not own tournament', async () => {
    const repo = createTournamentRepositoryWithDefaultTournament();
    // change user id of tournament
    repo.tournaments[TOURNAMENT_ID.toString()].userId = ObjectID.generate();

    const route = createRoute(new RoundRepositoryDummy(), repo);
    const response = new Response();

    const body = {
      tournamentId: TOURNAMENT_ID.toString(),
      round: createValidRound()
    };
    await route.route(Request.withBody(body), response);

    expect(response.status).toBe(401);
  });

  test('Returns status 404 if tournament does not exist', async () => {
    const route = createRoute();
    const response = new Response();

    const body = {
      tournamentId: ObjectID.generate(), // another tournament id
      round: createValidRound()
    };
    await route.route(Request.withBody(body), response);

    expect(response.status).toBe(404);
  });
});
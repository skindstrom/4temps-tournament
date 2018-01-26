// @flow

import { CreateRoundRoute } from '../create-round';
import type { RoundRepository } from '../../../data/round';
import type { TournamentRepository } from '../../../data/tournament';

import * as Test from '../test-utils';

function createRoute(roundRepo: RoundRepository =
  new Test.RoundRepositoryImpl(), tournamentRepo: ?TournamentRepository) {
  if (!tournamentRepo) {
    tournamentRepo = createTournamentRepositoryWithDefaultTournament();
  }
  return new CreateRoundRoute(roundRepo, tournamentRepo);
}

function createTournamentRepositoryWithDefaultTournament() {
  const tournamentRepo = new Test.TournamentRepositoryImpl();
  tournamentRepo.tournaments[Test.TOURNAMENT_ID.toString()] = {
    _id: Test.TOURNAMENT_ID,
    userId: Test.USER_ID,
    name: 'tour',
    date: new Date(),
    type: 'jj'
  };
  return tournamentRepo;
}

function requestWithRound(round: mixed): ServerApiRequest {
  return Test.Request.withBody({
    tournamentId: Test.TOURNAMENT_ID.toString(),
    round: round
  });
}

describe('/api/round/create route', () => {
  test('Empty body returns status 400', async () => {
    const response = new Test.Response();
    const route = createRoute();

    await route.route(requestWithRound({}), response);

    expect(response.status).toBe(400);
  });

  test('Invalid round returns status 400', async () => {
    const response = new Test.Response();
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
    const response = new Test.Response();

    await route.route(requestWithRound(Test.createRound()), response);

    expect(response.status).toBe(200);
  });

  test('An invalid round does not cause a round to be created', async () => {
    const repository = new Test.RoundRepositoryImpl();
    const route = createRoute(repository);

    await route.route(requestWithRound({
      tournamentId: '',
      round: {}
    }), new Test.Response());

    expect(await repository.getForTournament(Test.TOURNAMENT_ID.toString()))
      .toHaveLength(0);
  });

  test('A valid round gets added to the repository', async () => {
    const repository = new Test.RoundRepositoryImpl();
    const route = createRoute(repository);

    const {_id, ...round} = Test.createRound();
    await route.route(requestWithRound(round), new Test.Response());

    expect(await repository.getForTournament(Test.TOURNAMENT_ID.toString()))
      .toMatchObject([round]);
  });

  test('A valid round gets added to the end of the repository', async () => {
    const tournamentId = Test.TOURNAMENT_ID.toString();
    const repository = new Test.RoundRepositoryImpl();
    await repository.create(tournamentId, Test.createRound());
    const route = createRoute(repository);

    const {_id, ...round} = Test.createRound();
    await route.route(requestWithRound(round), new Test.Response());

    expect((await repository.getForTournament(tournamentId))[1])
      .toMatchObject(round);
  });

  test('A valid round has an ID generated', async () => {
    const repository = new Test.RoundRepositoryImpl();
    const route = createRoute(repository);

    const round = Test.createRound();
    await route.route(requestWithRound(round), new Test.Response());

    expect(
      repository._rounds[Test.TOURNAMENT_ID.toString()][0]._id.length)
      .toBeGreaterThan(0);
  });

  test('Error during creation returns status 500', async () => {
    class ThrowingRepository extends Test.RoundRepositoryImpl {
      create = () => {
        throw {};
      }
    }
    const route = createRoute(new ThrowingRepository());
    const response = new Test.Response();

    await route.route(requestWithRound(Test.createRound()), response);

    expect(response.status).toBe(500);
  });

  test('Returns status 401 if user does not own tournament', async () => {
    const repo = createTournamentRepositoryWithDefaultTournament();
    // change user id of tournament
    repo.tournaments[Test.TOURNAMENT_ID.toString()].userId = Test.generateId();

    const route = createRoute(new Test.RoundRepositoryImpl(), repo);
    const response = new Test.Response();

    const body = {
      tournamentId: Test.TOURNAMENT_ID.toString(),
      round: Test.createRound()
    };
    await route.route(Test.Request.withBody(body), response);

    expect(response.status).toBe(401);
  });

  test('Returns status 404 if tournament does not exist', async () => {
    const route = createRoute();
    const response = new Test.Response();

    const body = {
      tournamentId: Test.generateId(), // another tournament id
      round: Test.createRound()
    };
    await route.route(Test.Request.withBody(body), response);

    expect(response.status).toBe(404);
  });

  test('Valid round returns tournamentId and round', async () => {
    const tournamentId = Test.TOURNAMENT_ID.toString();
    const {_id, ...round} = Test.createRound();
    const route = createRoute();
    const response = new Test.Response();

    await route.route(requestWithRound(round), response);

    expect(response.body).toMatchObject({tournamentId, round});
  });
});

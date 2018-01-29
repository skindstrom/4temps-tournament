// @flow

import {
  Request, Response,
  TournamentRepositoryImpl as TournamentRepository,
  RoundRepositoryImpl as RoundRepository,
  generateId, createRound, createTournament
} from '../../../test-utils';
import GetRoundRoute from '../get-rounds';
import type { RoundDbModel } from '../../../data/round';

describe('/api/round/get?tournamentId=', () => {
  test('Missing tournamentId query parameter returns status 400', async () => {
    const route = createRoute();
    const response = new Response();

    await route.route(Request.withQuery({}), response);

    expect(response.getStatus()).toBe(400);
  });

  test('Non-existing tournamentId results in 404 ', async () => {
    const route = createRoute();
    const response = new Response();

    await route.route(Request.withQuery({tournamentId: 'other'}), response);

    expect(response.getStatus()).toBe(404);
  });

  test('Invalid user returns status 401', async () => {
    const tournament = createTournament();
    tournament.creatorId = generateId(); // other user

    const repository = new TournamentRepository();
    await repository.create(tournament);

    const route = createRoute(repository);
    const response = new Response();

    await route.route(
      Request.withQuery({ tournamentId: tournament._id.toString() }), response);

    expect(response.getStatus()).toBe(401);
  });

  test('No errors results in status 200', async () => {
    const tournament = createTournament();
    const repository =
      await createTournamentRepositoryWithTournament(tournament);

    const response = new Response();
    const route = createRoute(repository);

    await route.route(Request.withQuery({
      tournamentId: tournament._id.toString()
    }), response);

    expect(response.getStatus()).toBe(200);
  });

  test('No errors returns the rounds', async () => {
    const tournament = createTournament();
    const tournamentId = tournament._id.toString();
    const tournamentRepository =
      await createTournamentRepositoryWithTournament(tournament);

    const rounds = createRounds(tournamentId);
    const roundRepository =
      createRoundRepositoryWithRounds(tournamentId, rounds);

    const response = new Response();
    const route = createRoute(tournamentRepository, roundRepository);

    await route.route(Request.withQuery({ tournamentId }), response);

    expect(response.getBody()).toEqual({ tournamentId, rounds });
  });
});

function createRoute(
  tournamentRepository: TournamentRepository = new TournamentRepository(),
  roundRepository: RoundRepository = new RoundRepository()) {
  return new GetRoundRoute(tournamentRepository, roundRepository);
}

async function createTournamentRepositoryWithTournament(
  tournament: Tournament) {

  const repository = new TournamentRepository();
  await repository.create(tournament);
  return repository;
}

function createRoundRepositoryWithRounds(
  tournamentId: string, rounds: Array<RoundDbModel>) {
  const repository = new RoundRepository();
  rounds.forEach(r => repository.create(tournamentId, r));
  return repository;
}

function createRounds(tournamentId: string): Array<RoundDbModel> {
  const dbRound = { ...createRound(), _id: '23', tournamentId, };
  // $FlowFixMe
  return [dbRound, dbRound, dbRound];
}

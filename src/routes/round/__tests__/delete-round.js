// @flow

import {
  generateId,
  Request,
  Response,
  TournamentRepositoryImpl as TournamentRepository,
  createTournament,
  createRound
} from '../../../test-utils';
import DeleteRoundRoute from '../delete-round';

describe('/api/round/delete', () => {
  const tournament = createTournament();
  const round = { ...createRound(), id: generateId() };
  const tournamentId = tournament.id;
  const roundId = round.id;

  let response: Response;
  let tournamentRepository: TournamentRepository;
  let route: DeleteRoundRoute;

  beforeEach(async () => {
    response = new Response();
    tournamentRepository = new TournamentRepository();

    tournamentRepository.create(tournament);

    route = new DeleteRoundRoute(tournamentRepository);
  });

  test('Invalid params returns status 400', async () => {
    await route.route(Request.withParams({}), response);
    expect(response.getStatus()).toBe(400);

    await route.route(Request.withParams({ tournamentId: '123' }), response);
    expect(response.getStatus()).toBe(400);

    await route.route(Request.withParams({ roundId: '123' }), response);
    expect(response.getStatus()).toBe(400);
  });

  test('If round does not exist, status 404 is returned', async () => {
    await route.route(
      Request.withParams({
        roundId: generateId(),
        tournamentId: generateId()
      }),
      response
    );

    expect(response.getStatus()).toBe(404);
  });

  test('If user does not own the tournament, status 401 is returned', async () => {
    await tournamentRepository.create({
      ...createTournament(),
      creatorId: generateId()
    });

    await route.route(
      Request.withParams({
        roundId,
        tournamentId
      }),
      response
    );

    expect(response.getStatus()).toBe(401);
  });

  test('If tournament could not get fetched, status 500 is returned', async () => {
    tournamentRepository.get = () => {
      throw {};
    };

    await route.route(
      Request.withParams({
        roundId,
        tournamentId
      }),
      response
    );

    expect(response.getStatus()).toBe(500);
  });

  test('If a round could not get deleted, status 500 is returned', async () => {
    tournamentRepository.deleteRound = () => {
      throw 'Fake error!';
    };
    await route.route(
      Request.withParams({
        roundId,
        tournamentId
      }),
      response
    );

    expect(response.getStatus()).toBe(500);
  });

  test('Successful delete returns status 200 and the deleted id', async () => {
    await route.route(Request.withParams({ roundId, tournamentId }), response);

    expect(response.getStatus()).toBe(200);
    expect(response.getBody()).toEqual({ tournamentId, roundId });
  });
});

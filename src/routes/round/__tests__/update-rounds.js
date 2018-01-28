// @flow

import {
  createUser,
  generateId,
  Request,
  Response,
  TournamentRepositoryImpl as TournamentRepository,
  RoundRepositoryImpl as RoundRepository,
  createTournament,
  createRound
} from '../../test-utils';
import UpdateRoundsRoute from '../update-rounds';

describe('/api/round/update', () => {
  const user = createUser();

  let response: Response;
  let tournamentRepository: TournamentRepository;
  let roundRepository: RoundRepository;
  let route: UpdateRoundsRoute;

  beforeEach(() => {
    response = new Response();
    tournamentRepository = new TournamentRepository();
    roundRepository = new RoundRepository();
    route = new UpdateRoundsRoute(tournamentRepository, roundRepository);
  });

  test('Invalid body returns status 400', async() => {
    await route.route(Request.withBody({}), response);
    expect(response.status).toBe(400);

    await route.route(Request.withBody({
      tournamentId: '123'
    }), response);
    expect(response.status).toBe(400);

    await route.route(Request.withBody({
      rounds: []
    }), response);
    expect(response.status).toBe(400);
  });

  test('Invalid round returns status 400', async() => {
    const round = createRound();
    // $FlowFixMe: I break it on purpose
    round.name = undefined;

    await route.route(
      Request.withBody({
        tournamentId: 'id',
        rounds: [round]
      }), response);
    expect(response.status).toBe(400);
  });

  test('Invalid tournamentId type returns status 400', async() => {
    const round = createRound();
    // $FlowFixMe: I break it on purpose
    round.name = undefined;

    await route.route(
      Request.withBody({
        tournamentId: 'id',
        rounds: [round]
      }), response);
    expect(response.status).toBe(400);
  });

  test('If tournament does not exist, status 404 is returned', async() => {
    const body = {
      tournamentId: generateId(),
      rounds: []
    };

    await route.route(Request.withUserAndBody(user, body), response);

    expect(response.status).toBe(404);
  });

  test('If user does not own the tournament, status 401 is returned',
    async() => {
      const tournament: Tournament = {...createTournament(),
        creatorId: generateId()
      };
      tournamentRepository.create(tournament);

      const body = {
        tournamentId: tournament._id.toString(),
        rounds: []
      };

      await route.route(Request.withUserAndBody(user, body), response);

      expect(response.status).toBe(401);
    });

  test('If tournament could not get fetched, status 500 is returned',
    async () => {
      const tournament = createTournament();
      await tournamentRepository.create(tournament);

      tournamentRepository.get = () => {throw {};};

      route = new UpdateRoundsRoute(tournamentRepository, roundRepository);
      const body = {
        tournamentId: tournament._id.toString(),
        rounds: []
      };

      await route.route(Request.withUserAndBody(user, body), response);

      expect(response.status).toBe(500);
    });

  test('If rounds could not get updated, status 500 is returned', async() => {
    const tournament = createTournament();
    const id = tournament._id.toString();
    await tournamentRepository.create(tournament);

    roundRepository.update = () => {throw {};};
    route = new UpdateRoundsRoute(tournamentRepository, roundRepository);

    const body = {
      tournamentId: id,
      rounds: []
    };
    await route.route(Request.withUserAndBody(user, body), response);

    expect(response.status).toBe(500);
  });

  test('Successful update returns status 200 and the updated rounds',
    async () => {
      const tournament = createTournament();
      const id = tournament._id.toString();
      await tournamentRepository.create(tournament);

      const body = {
        tournamentId: id,
        rounds: [createRound()]
      };
      await route.route(Request.withUserAndBody(user, body), response);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(body);
    });
});

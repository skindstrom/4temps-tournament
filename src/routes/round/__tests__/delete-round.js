// @flow

import {
  generateId,
  Request,
  Response,
  TournamentRepositoryImpl as TournamentRepository,
  RoundRepositoryImpl as RoundRepository,
  createTournament,
  createRound
} from '../../test-utils';
import DeleteRoundRoute from '../delete-round';

describe('/api/round/delete', () => {
  let response: Response;
  let tournamentRepository: TournamentRepository;
  let roundRepository: RoundRepository;
  let route: DeleteRoundRoute;

  beforeEach(() => {
    response = new Response();
    tournamentRepository = new TournamentRepository();
    roundRepository = new RoundRepository();
    route = new DeleteRoundRoute(tournamentRepository, roundRepository);
  });

  test('Invalid params returns status 400', async() => {
    await route.route(Request.withParams({}), response);
    expect(response.status).toBe(400);

    await route.route(Request.withParams({tournamentId: '123'}), response);
    expect(response.status).toBe(400);

    await route.route(Request.withParams({roundId: '123'}), response);
    expect(response.status).toBe(400);
  });

  test('If round does not exist, status 404 is returned', async () => {
    await route.route(
      Request.withParams({
        roundId: generateId(),
        tournamentId: generateId()
      }), response);

    expect(response.status).toBe(404);
  });

  test('If user does not own the tournament, status 401 is returned',
    async() => {
      const tournament: Tournament = {...createTournament(),
        creatorId: generateId()
      };
      const round: Round = {...createRound(), _id: generateId()};

      await tournamentRepository.create(tournament);
      await roundRepository.create(tournament._id.toString(), round);

      await route.route(Request.withParams({
        roundId: round._id.toString(),
        tournamentId: tournament._id.toString()
      }), response);

      expect(response.status).toBe(401);
    });

  test('If tournament could not get fetched, status 500 is returned',
    async () => {
      const tournament = {...createTournament()};
      const round = {...createRound(), _id: generateId().toString()};

      const roundId = round._id.toString();
      const tournamentId = tournament._id.toString();

      await tournamentRepository.create(tournament);
      await roundRepository.create(tournament._id.toString(), round);

      tournamentRepository.get = () => {throw {};};

      route = new DeleteRoundRoute(tournamentRepository, roundRepository);
      await route.route(Request.withParams({
        roundId,
        tournamentId
      }), response);

      expect(response.status).toBe(500);
    });

  test('If a round could not get deleted, status 500 is returned', async() => {
    const tournament = {...createTournament()};
    const round = {...createRound(), _id: generateId().toString()};

    const roundId = round._id.toString();
    const tournamentId = tournament._id.toString();

    await tournamentRepository.create(tournament);
    await roundRepository.create(tournament._id.toString(), round);

    roundRepository.delete = () => {throw {};};

    route = new DeleteRoundRoute(tournamentRepository, roundRepository);
    await route.route(Request.withParams({
      roundId,
      tournamentId
    }), response);

    expect(response.status).toBe(500);
  });

  test('Successful delete returns status 200 and the deleted id',
    async () => {
      const tournament = createTournament();
      const tournamentId = tournament._id.toString();
      const roundId = generateId().toString();
      const round = {...createRound(), _id: roundId};

      await tournamentRepository.create(tournament);
      await roundRepository.create(tournamentId, round);

      await route.route(
        Request.withParams({ roundId, tournamentId }), response);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({tournamentId, roundId});
    });
});

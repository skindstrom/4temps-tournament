// @flow
import { getTournamentRoute } from '../get-tournament';
import {
  generateId,
  createTournament,
  TournamentRepositoryImpl as TournamentRepository
} from '../../../test-utils';

describe('/api/tournament/get', () => {
  const tournament = createTournament();
  let tournamentRepository: TournamentRepository;

  beforeEach(async () => {
    tournamentRepository = new TournamentRepository();
    await tournamentRepository.create(tournament);
  });

  test('Existing tournament is returned with status 200 if user created it',
    async () => {
      expect(await getTournamentRoute(
        tournament._id,
        tournament.creatorId,
        tournamentRepository))
        .toEqual({
          status: 200,
          body: tournament
        });
    });

  test('Returns 404 and null tournament if tournament does not exist',
    async () => {
      expect(await getTournamentRoute(
        generateId(), generateId(), tournamentRepository))
        .toEqual({
          status: 404,
          body: null
        });
    });

  test('Returns 401 and null tournament if tournament was not created by user',
    async () => {
      expect(await getTournamentRoute(
        tournament._id,
        generateId(),
        tournamentRepository))
        .toEqual({
          status: 401,
          body: null
        });
    });
});

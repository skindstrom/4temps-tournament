// @flow
import { createTournamentRoute } from '../create-tournament';
import {
  createTournament,
  TournamentRepositoryImpl as TournamentRepository
} from '../../../test-utils';

describe('/api/tournament/create', () => {
  const tournament = createTournament();
  let repository: TournamentRepository;

  beforeEach(() => {
    repository = new TournamentRepository();
  });

  test('Valid tournament returns 200 and the new tournamentid', async () => {
    expect(
      await createTournamentRoute(
        tournament.creatorId, tournament, repository))
      .toEqual({
        status: 200,
        body: tournament
      });
  });

  test('Valid tournament gets created', async () => {
    await createTournamentRoute(
      tournament.creatorId, tournament, repository);
    expect(await repository.get(tournament.id))
      .toEqual(tournament);
  });

  test('Tournament is validated and returns status 400 when invalid',
    async () => {
      const invalidTournament = {...tournament, name: ''};
      expect(
        await createTournamentRoute(
          tournament.creatorId, invalidTournament, repository))
        .toEqual({
          status: 400,
          body: null
        });
    });

  test('Returns status 500 when a valid tournament can not be created',
    async () => {
      // $FlowFixMe
      repository.create = () => new Promise((resolve, reject) => reject());
      expect(
        await createTournamentRoute(
          tournament.creatorId, tournament, repository))
        .toEqual({
          status: 500,
          body: null
        });
    });
});

// @flow
import {
  createTournament, generateId,
  TournamentRepositoryImpl as TournamentRepository
} from '../../test-utils';
import { updateTournamentRoute } from '../update-tournament';

describe('/api/tournament/update', () => {
  const tournament = createTournament();
  let repository: TournamentRepository;

  beforeEach(async () => {
    repository = new TournamentRepository();
    await repository.create(tournament);
  });

  test(
    'Valid tournament with correct user returns new tournament with status 200',
    async () => {
      expect(
        await updateTournamentRoute(
          tournament.creatorId,
          tournament,
          repository))
        .toEqual({
          status: 200,
          body: tournament
        });
    });

  test('Tournament is validated and returns status 400 when invalid',
    async () => {
      expect(
        await updateTournamentRoute(
          tournament.creatorId,
          {...tournament, name: ''},
          repository))
        .toEqual({
          status: 400,
          body: null
        });
    });

  test(`Tournament that doesn't exist returns 404`, async () => {
    const otherId = generateId().toString();
    expect(
      await updateTournamentRoute(
        tournament.creatorId,
        {...tournament, _id: otherId},
        repository))
      .toEqual({
        status: 404,
        body: null
      });
  });

  test(`When tournament can't be updated 500 is returned`, async () => {
    repository.update = () => {throw 0;};
    expect(
      await updateTournamentRoute(
        tournament.creatorId,
        tournament,
        repository))
      .toEqual({
        status: 500,
        body: null
      });
  });

  test(`When tournament is owned by other user be updated 401 is returned`,
    async () => {
      const otherId = generateId().toString();
      expect(
        await updateTournamentRoute(
          otherId,
          tournament,
          repository))
        .toEqual({
          status: 401,
          body: null
        });
    });

});

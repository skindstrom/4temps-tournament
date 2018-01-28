// @flow
import {createTournament, generateId} from '../../test-utils';
import { updateTournamentRoute } from '../update-tournament';

describe('/api/tournament/update', () => {
  const nullPromise = () => new Promise(resolve => resolve(null));
  const tournament = createTournament();
  const getTournament = (id: string) => {
    if (id === tournament._id) {
      return new Promise(resolve => resolve(tournament));
    } else {
      return new Promise(resolve => resolve(null));
    }
  };

  const updateTournament = () =>
    new Promise(resolve => resolve(tournament));


  test(
    'Valid tournament with correct user returns new tournament with status 200',
    async () => {
      expect(
        await updateTournamentRoute(
          tournament.creatorId,
          tournament._id,
          tournament,
          getTournament,
          updateTournament))
        .toEqual({
          status: 200,
          body: tournament
        });
    });

  test('Tournament is validated and returns status 400 when invalid',
    async () => {

      expect(
        await updateTournamentRoute(tournament.creatorId, tournament._id,
          {...tournament, name: ''}, getTournament, updateTournament))
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
        otherId,
        {...tournament, tournamentId: otherId},
        getTournament,
        updateTournament))
      .toEqual({
        status: 404,
        body: null
      });
  });

  test(`When tournament can't be updated 500 is returned`, async () => {
    expect(
      await updateTournamentRoute(
        tournament.creatorId,
        tournament._id,
        tournament,
        getTournament,
        nullPromise))
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
          tournament._id,
          tournament,
          getTournament,
          updateTournament))
        .toEqual({
          status: 401,
          body: null
        });
    });

});

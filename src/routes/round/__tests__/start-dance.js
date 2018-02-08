// @flow
import {
  Request, Response,
  createTournament, createRound, generateId,
  TournamentRepositoryImpl
} from '../../../test-utils';
import StartDanceRoute from '../start-dance';

describe('Start dance API', () => {
  const repo = new TournamentRepositoryImpl();
  const tournament = createTournament();

  beforeAll(async () => {
    await repo.create(tournament);
  });

  test('Returns 404 if tournament doest exist', async () => {
    const req =
      Request.withParams({ tournamentId: generateId() });
    const res = new Response();
    const route = new StartDanceRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Returns 404 if there is no active round', async () => {
    await repo.createRound(tournament.id,
      {
        ...createRound(),
        active: false,
        finished: true
      });
    await repo.createRound(tournament.id,
      {
        ...createRound(),
        active: false,
        finished: false
      });
    const req =
      Request.withParams({ tournamentId: tournament.id });
    const res = new Response();
    const route = new StartDanceRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Returns 200 and the new round if there is an active round',
    async () => {
      const activeRound: Round = {
        ...createRound(),
        groups: [{
          id: generateId(),
          pairs: [],
          dances: [
            { id: generateId(), active: false, finished: true },
            { id: generateId(), active: false, finished: false }],
        }],
        active: true,
        finished: false
      };

      const expected = { ...activeRound };
      expected.groups[0].dances[1].active = true;

      await repo.createRound(tournament.id, activeRound);
      const req =
        Request.withParams({ tournamentId: tournament.id });
      const res = new Response();
      const route = new StartDanceRoute(repo);

      await route.route(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(expected);
    });
});
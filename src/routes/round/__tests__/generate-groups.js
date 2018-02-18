// @flow
import {
  Request,
  Response,
  createTournament,
  createRound,
  generateId,
  createParticipant,
  TournamentRepositoryImpl
} from '../../../test-utils';
import GenerateGroupsRoute from '../generate-groups';

describe('Generate groups route', () => {
  const tournament = createTournament();
  const round = { ...createRound(), active: true };

  test('Returns status 200 and the round if success', async () => {
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round.id
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);

    expect(res.getBody()).toEqual(round);
  });

  test('Returns status 404 if the round does not exist', async () => {
    const repo = new TournamentRepositoryImpl();

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: generateId()
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Updates repository', async () => {
    const tournament = { ...createTournament(), id: generateId() };
    const round = { ...createRound(), active: true };
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

    const participants = [
      { ...createParticipant(), role: 'leader' },
      { ...createParticipant(), role: 'follower' }
    ];

    await repo.create(tournament);
    await repo.createParticipant(tournament.id, participants[0]);
    await repo.createParticipant(tournament.id, participants[1]);

    const expectedRound = {
      ...round,
      active: true,
      groups: [
        {
          pairs: [
            {
              leader: participants[0].id,
              follower: participants[1].id
            }
          ]
        }
      ]
    };

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round.id
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    expect((await repo.get(tournament.id)).rounds[0]).toMatchObject(
      expectedRound
    );
  });

  test('Returns 400 if round is not started', async () => {
    const repo = new TournamentRepositoryImpl();

    const startedRound = { ...createRound(), active: false };
    const tournament = { ...createTournament(), rounds: [startedRound] };
    await repo.create(tournament);
    await repo.createRound(tournament.id, startedRound);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: startedRound.id
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(400);
  });

  test('Returns 400 if round is already finished', async () => {
    const repo = new TournamentRepositoryImpl();

    const startedRound = { ...createRound(), finished: true };
    const tournament = { ...createTournament(), rounds: [startedRound] };
    await repo.create(tournament);
    await repo.createRound(tournament.id, startedRound);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: startedRound.id
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(400);
  });

  test('Uses the winners of the previous round', async () => {
    const participants = [
      { ...createParticipant(), role: 'leader' },
      { ...createParticipant(), role: 'follower' },
      { ...createParticipant(), role: 'leader' },
      { ...createParticipant(), role: 'follower' }
    ];
    const round1 = {
      ...createRound(),
      active: false,
      finished: true,
      winners: {
        leaders: [participants[0].id],
        followers: [participants[1].id]
      }
    };
    const round2 = { ...createRound(), active: true };

    const tournament = {
      ...createTournament(),
      id: generateId(),
      rounds: [round1, round2],
      participants
    };
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);

    const expectedRound = {
      ...round2,
      active: true,
      groups: [
        {
          pairs: [
            {
              leader: participants[0].id,
              follower: participants[1].id
            }
          ]
        }
      ]
    };

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round2.id
    });
    const res = new Response();
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toMatchObject(expectedRound);
  });
});

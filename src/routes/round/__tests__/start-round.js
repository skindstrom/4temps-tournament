// @flow
import {
  Request,
  Response,
  createTournament,
  createRound,
  generateId,
  TournamentRepositoryImpl,
  createParticipant
} from '../../../test-utils';
import StartRoundRoute from '../start-round';

describe('Start round route', () => {
  const tournament = createTournament();
  const round = createRound();

  test('Returns status 200 and the round if success', async () => {
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round.id
    });
    const res = new Response();
    const route = new StartRoundRoute(repo);

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
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Updates repository', async () => {
    const tournament = { ...createTournament(), id: generateId() };
    const round = { ...createRound(), active: false };
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

    await repo.create(tournament);

    const expectedRound = {
      ...round,
      active: true
    };

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round.id
    });
    const res = new Response();
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    expect((await repo.get(tournament.id)).rounds[0]).toMatchObject(
      expectedRound
    );
  });

  test('Generates groups', async () => {
    const round = { ...createRound(), active: false, finished: false };
    const participants = [
      { ...createParticipant(), role: 'leader' },
      { ...createParticipant(), role: 'follower' }
    ];

    const tournament = {
      ...createTournament(),
      id: generateId(),
      rounds: [round],
      participants
    };
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

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
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    expect((await repo.get(tournament.id)).rounds[0]).toMatchObject(
      expectedRound
    );
  });

  test('Returns 400 if round is already started', async () => {
    const repo = new TournamentRepositoryImpl();

    const startedRound = { ...createRound(), active: true };
    const tournament = { ...createTournament(), rounds: [startedRound] };
    await repo.create(tournament);
    await repo.createRound(tournament.id, startedRound);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: startedRound.id
    });
    const res = new Response();
    const route = new StartRoundRoute(repo);

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
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(400);
  });

  test('Generates as many groups as possible, without participants competing twice', async () => {
    const round = {
      ...createRound(),
      minPairCountPerGroup: 1,
      maxPairCountPerGroup: 1,
      active: false,
      finished: false
    };
    const participants = [
      { ...createParticipant(), id: 'l1', role: 'leader' },
      { ...createParticipant(), id: 'l2', role: 'leader' },
      { ...createParticipant(), id: 'l3', role: 'leader' },
      { ...createParticipant(), id: 'l4', role: 'leader' },
      { ...createParticipant(), id: 'l5', role: 'leader' },
      { ...createParticipant(), id: 'f1', role: 'follower' },
      { ...createParticipant(), id: 'f2', role: 'follower' },
      { ...createParticipant(), id: 'f3', role: 'follower' }
    ];

    const tournament = {
      ...createTournament(),
      id: generateId(),
      rounds: [round],
      participants
    };
    const repo = new TournamentRepositoryImpl();
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);

    await repo.create(tournament);

    const req = Request.withParams({
      tournamentId: tournament.id,
      roundId: round.id
    });
    const res = new Response();
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    expect(repo._tournaments[tournament.id].rounds[0].groups).toHaveLength(3);
  });
});

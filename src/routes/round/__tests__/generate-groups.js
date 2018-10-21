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
      passingCouplesCount: 1,
      roundScores: [
        {
          participantId: participants[0].id,
          score: 10
        },
        { participantId: participants[1].id, score: 6 },
        { participantId: participants[2].id, score: 5 },
        { participantId: participants[3].id, score: 4 }
      ],
      groups: [
        {
          id: 'group1',
          pairs: [
            { leader: participants[0].id, follower: participants[1].id },
            { leader: participants[2].id, follower: participants[3].id }
          ],
          dances: [
            {
              id: 'dance1',
              active: false,
              finished: true
            }
          ]
        }
      ]
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

  test('Generates as many groups as possible, without participants competing twice', async () => {
    const round = {
      ...createRound(),
      minPairCountPerGroup: 1,
      maxPairCountPerGroup: 2,
      active: true,
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
    const route = new GenerateGroupsRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    expect(repo._tournaments[tournament.id].rounds[0].groups).toHaveLength(2);
  });
});

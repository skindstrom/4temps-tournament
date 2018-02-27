// @flow
import {
  Request,
  Response,
  createTournament,
  createRound,
  TournamentRepositoryImpl,
  NoteRepositoryImpl,
  createParticipant
} from '../../../test-utils';

import route from '../regenerate-group';

describe('Regenerate group route', () => {
  const noteRepository = new NoteRepositoryImpl();
  let tournamentRepository: TournamentRepositoryImpl;
  let tournament: Tournament;

  beforeEach(async () => {
    tournamentRepository = new TournamentRepositoryImpl();
    tournament = createTestTournament();
    await tournamentRepository.create(tournament);
  });

  test("Returns 404 if group doesn't exist", async () => {
    const req = Request.withParams({
      tournamentId: 'tournament1',
      roundId: 'round1',
      groupId: 'anotherGroupId'
    });
    const res = new Response();

    await route(tournamentRepository, noteRepository)(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Returns 400 if group is started', async () => {
    tournament.rounds[0].groups[0].dances[0].active = true;
    const req = Request.withParams({
      tournamentId: 'tournament1',
      roundId: 'round1',
      groupId: 'group1'
    });
    const res = new Response();

    await route(tournamentRepository, noteRepository)(req, res);

    expect(res.getStatus()).toBe(400);
  });

  test('Replaces group', async () => {
    // remove first leader
    tournament.participants[0].isAttending = false;

    const req = Request.withParams({
      tournamentId: 'tournament1',
      roundId: 'round1',
      groupId: 'group1'
    });
    const res = new Response();

    await route(tournamentRepository, noteRepository)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(tournament.rounds[0].groups[0]).not.toEqual(createTestGroup());
    expect(tournament.rounds[0].groups[0].pairs[0]).toMatchObject({
      leader: 'leader2'
    });
  });

  test('Replaces any groups after the requested group', async () => {
    const group2 = { ...createTestGroup(), id: 'group2' };
    tournament.rounds[0].groups.push(group2);
    const req = Request.withParams({
      tournamentId: 'tournament1',
      roundId: 'round1',
      groupId: 'group1'
    });
    const res = new Response();

    await route(tournamentRepository, noteRepository)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(tournament.rounds[0].groups[0]).not.toEqual(createTestGroup());
    expect(tournament.rounds[0].groups[1]).not.toEqual(group2);
  });

  test('May request only a later group', async () => {
    const group2 = { ...createTestGroup(), id: 'group2' };
    tournament.rounds[0].groups.push(group2);
    const req = Request.withParams({
      tournamentId: 'tournament1',
      roundId: 'round1',
      groupId: 'group2'
    });
    const res = new Response();

    await route(tournamentRepository, noteRepository)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(tournament.rounds[0].groups[0]).toEqual(createTestGroup());
    expect(tournament.rounds[0].groups[1]).not.toEqual(group2);
  });

  describe('Three groups', () => {
    let group2: DanceGroup;
    let group3: DanceGroup;
    beforeEach(() => {
      group2 = { ...createTestGroup(), id: 'group2' };
      group3 = { ...createTestGroup(), id: 'group3' };
      tournament.rounds[0].groups.push(group2);
      tournament.rounds[0].groups.push(group3);
    });

    test('May generate the two last', async () => {
      const req = Request.withParams({
        tournamentId: 'tournament1',
        roundId: 'round1',
        groupId: 'group2'
      });
      const res = new Response();

      await route(tournamentRepository, noteRepository)(req, res);

      expect(res.getStatus()).toBe(200);
      expect(tournament.rounds[0].groups[0]).toEqual(createTestGroup());
      expect(tournament.rounds[0].groups[1]).not.toEqual(group2);
      expect(tournament.rounds[0].groups[2]).not.toEqual(group3);
    });

    test('May request only last', async () => {
      const req = Request.withParams({
        tournamentId: 'tournament1',
        roundId: 'round1',
        groupId: 'group3'
      });
      const res = new Response();

      await route(tournamentRepository, noteRepository)(req, res);

      expect(res.getStatus()).toBe(200);
      expect(tournament.rounds[0].groups[0]).toEqual(createTestGroup());
      expect(tournament.rounds[0].groups[1]).toEqual(group2);
      expect(tournament.rounds[0].groups[2]).not.toEqual(group3);
    });
  });
});

function createTestTournament(): Tournament {
  return {
    ...createTournament(),
    id: 'tournament1',
    participants: createTestParticipants(),
    rounds: [createTestRound()]
  };
}

function createTestRound(): Round {
  return {
    ...createRound(),
    id: 'round1',
    active: true,
    finished: false,
    groups: [createTestGroup()]
  };
}

function createTestGroup(): DanceGroup {
  return {
    id: 'group1',
    dances: [
      {
        id: 'dance1',
        active: false,
        finished: false
      }
    ],
    pairs: [{ leader: 'leader1', follower: 'follower1' }]
  };
}

function createTestParticipants(): Array<Participant> {
  return [
    {
      ...createParticipant(),
      role: 'leader',
      id: 'leader1',
      isAttending: true
    },
    {
      ...createParticipant(),
      role: 'leader',
      id: 'leader2',
      isAttending: true
    },
    {
      ...createParticipant(),
      role: 'follower',
      id: 'follower1',
      isAttending: true
    },
    {
      ...createParticipant(),
      role: 'follower',
      id: 'follower2',
      isAttending: true
    }
  ];
}

// @flow
import {
  generateId,
  Request,
  Response,
  TournamentRepositoryImpl,
  createRound,
  createTournament,
  createJudge,
  createParticipant
} from '../../../test-utils';
import SettleDrawRoute from '../settle-draw';

it('Returns 404 if tournament is not found', async () => {
  const req = Request.withParams({ tournamentId: generateId() });
  const res = new Response();
  const route = new SettleDrawRoute(new TournamentRepositoryImpl());

  await route.route(req, res);

  expect(res.getStatus()).toBe(404);
  expect(res.getBody()).toEqual({ error: 'no such tournament' });
});

it('Returns 403 if user is not a president judge', async () => {
  const judge: Judge = { ...createJudge(), judgeType: 'normal' };
  const tournament: Tournament = { ...createTournament(), judges: [judge] };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  const req = Request.withJudgeAndParams(judge, {
    tournamentId: tournament.id
  });
  const res = new Response();
  await route.route(req, res);

  expect(res.getStatus()).toBe(403);
  expect(res.getBody()).toEqual({ error: 'must be president judge' });
});

it('Returns 404 if there is no round that is active', async () => {
  const president: Judge = { ...createJudge(), judgeType: 'president' };
  const round: Round = {
    ...createRound(),
    draw: false,
    active: false,
    finished: false
  };
  const tournament: Tournament = {
    ...createTournament(),
    judges: [president],
    rounds: [round]
  };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  const req = Request.withJudgeAndParams(president, {
    tournamentId: tournament.id
  });
  const res = new Response();
  await route.route(req, res);

  expect(res.getStatus()).toBe(404);
  expect(res.getBody()).toEqual({ error: 'no round is active' });
});

it('Returns 404 if there is no round that is flagged as draw', async () => {
  const president: Judge = { ...createJudge(), judgeType: 'president' };
  const round: Round = {
    ...createRound(),
    draw: false,
    active: true,
    finished: false
  };
  const tournament: Tournament = {
    ...createTournament(),
    judges: [president],
    rounds: [round]
  };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  const req = Request.withJudgeAndParams(president, {
    tournamentId: tournament.id
  });
  const res = new Response();
  await route.route(req, res);

  expect(res.getStatus()).toBe(404);
  expect(res.getBody()).toEqual({ error: 'no round is draw' });
});

it('Returns 400 if not all participants are included in the score', async () => {
  const president: Judge = { ...createJudge(), judgeType: 'president' };
  const leader: Participant = { ...createParticipant(), role: 'leader' };
  const follower: Participant = { ...createParticipant(), role: 'follower' };
  const danceGroup: DanceGroup = {
    id: 'danceGroup',
    dances: [],
    pairs: [{ leader: leader.id, follower: follower.id }]
  };

  const round: Round = {
    ...createRound(),
    groups: [danceGroup],
    draw: true,
    active: true,
    finished: false
  };
  const tournament: Tournament = {
    ...createTournament(),
    judges: [president],
    participants: [leader, follower],
    rounds: [round]
  };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  // no follower score
  const leaderScore: Score = {
    participantId: leader.id,
    score: 10
  };

  const req = Request.withJudgeAndParams(president, {
    tournamentId: tournament.id
  });
  req.body = [leaderScore];

  const res = new Response();
  await route.route(req, res);

  expect(res.getStatus()).toBe(400);
  expect(res.getBody()).toEqual({
    error: 'score does not include all participants'
  });
});

it('Returns 400 if a participant not in the tournament is included in the score', async () => {
  const president: Judge = { ...createJudge(), judgeType: 'president' };
  const leader: Participant = { ...createParticipant(), role: 'leader' };
  const follower: Participant = { ...createParticipant(), role: 'follower' };
  const danceGroup: DanceGroup = {
    id: 'danceGroup',
    dances: [],
    pairs: [{ leader: leader.id, follower: follower.id }]
  };

  const round: Round = {
    ...createRound(),
    groups: [danceGroup],
    draw: true,
    active: true,
    finished: false
  };
  const tournament: Tournament = {
    ...createTournament(),
    judges: [president],
    participants: [leader, follower],
    rounds: [round]
  };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  const invalidParticipantScore: Score = {
    participantId: 'false id',
    score: 10
  };

  const roundScores: Array<Score> = [
    { participantId: leader.id, score: 10 },
    { participantId: follower.id, score: 5 },
    invalidParticipantScore
  ];
  const req = Request.withJudgeAndParams(president, {
    tournamentId: tournament.id
  });
  req.body = roundScores;

  const res = new Response();
  await route.route(req, res);

  expect(res.getStatus()).toBe(400);
  expect(res.getBody()).toEqual({
    error: 'score includes participant(s) not in this round'
  });
});

it('Returns 200 and ends round with updated score', async () => {
  const president: Judge = { ...createJudge(), judgeType: 'president' };
  const leader: Participant = { ...createParticipant(), role: 'leader' };
  const follower: Participant = { ...createParticipant(), role: 'follower' };

  const danceGroup: DanceGroup = {
    id: 'danceGroup',
    dances: [],
    pairs: [{ leader: leader.id, follower: follower.id }]
  };
  const round: Round = {
    ...createRound(),
    groups: [danceGroup],
    draw: true,
    active: true,
    finished: false
  };
  const tournament: Tournament = {
    ...createTournament(),
    judges: [president],
    participants: [leader, follower],
    rounds: [round]
  };

  const tournamentRepository = new TournamentRepositoryImpl();
  await tournamentRepository.create(tournament);

  const route = new SettleDrawRoute(tournamentRepository);

  const roundScores: Array<Score> = [
    { participantId: leader.id, score: 10 },
    { participantId: follower.id, score: 5 }
  ];
  const req = Request.withJudgeAndParams(president, {
    tournamentId: tournament.id
  });
  req.body = roundScores;

  const res = new Response();
  await route.route(req, res);

  const expectedRound: Round = {
    ...round,
    draw: false,
    active: false,
    finished: true,
    roundScores
  };
  expect(res.getStatus()).toBe(200);
  expect(res.getBody()).toEqual(expectedRound);
  expect((await tournamentRepository.get(tournament.id)).rounds[0]).toEqual(
    expectedRound
  );
});

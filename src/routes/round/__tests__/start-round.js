// @flow
import {
  Request, Response,
  createTournament, createRound, generateId, createParticipant,
  TournamentRepositoryImpl
} from '../../../test-utils';
import StartRoundRoute from '../start-round';

describe('Start round route', () => {

  const repo = new TournamentRepositoryImpl();
  const tournament = createTournament();
  const round = createRound();

  beforeAll(async () => {
    await repo.create(tournament);
    await repo.createRound(tournament.id, round);
  });


  test('Returns status 200 and the tournament if success', async () => {
    const req =
      Request.withParams({tournamentId: tournament.id, roundId: round.id});
    const res = new Response();
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);

    expect(res.getBody())
      .toEqual(tournament);
  });

  test('Returns status 404 if the round does not exist', async () => {
    const req =
      Request.withParams({tournamentId: tournament.id, roundId: generateId()});
    const res = new Response();
    const route = new StartRoundRoute(repo);


    await route.route(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('Updates repository', async () => {
    const participants = [
      {...createParticipant(), role: 'leader'},
      {...createParticipant(), role: 'follower'}
    ];

    await repo.create(tournament);
    await repo.createParticipant(
      tournament.id, participants[0]);
    await repo.createParticipant(
      tournament.id, participants[1]);

    const expectedRound = {
      ...round,
      active: true,
      groups: [
        {
          pairs: [
            {
              leader: participants[0].id, follower: participants[1].id
            }
          ]
        }
      ]
    };

    const req =
      Request.withParams({tournamentId: tournament.id, roundId: round.id});
    const res = new Response();
    const route = new StartRoundRoute(repo);

    await route.route(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    expect((await repo.get(tournament.id)).rounds)
      .toContainEqual(expectedRound);
  });
});

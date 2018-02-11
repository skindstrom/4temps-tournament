// @flow

import CreateRoundRoute from '../create-round';
import {
  generateId,
  TOURNAMENT_ID,
  Request,
  Response,
  createRound,
  createTournament,
  TournamentRepositoryImpl as TournamentRepository
} from '../../../test-utils';

describe('/api/round/create route', () => {
  const tournament = createTournament();
  let repo: TournamentRepository;

  beforeEach(async () => {
    repo = new TournamentRepository();
    await repo.create(tournament);
  });

  test('Empty body returns status 400', async () => {
    const response = new Response();
    const route = new CreateRoundRoute(repo);

    await route.route(requestWithRound({}), response);

    expect(response.getStatus()).toBe(400);
  });

  test('Invalid round returns status 400', async () => {
    const response = new Response();
    const route = new CreateRoundRoute(repo);

    await route.route(
      requestWithRound({ ...createRound(), name: '' }),
      response
    );

    expect(response.getStatus()).toBe(400);
  });

  test('Valid round returns status 200', async () => {
    const response = new Response();
    const { id, ...round } = createRound();
    const route = new CreateRoundRoute(repo);

    await route.route(requestWithRound(round), response);

    expect(response.getStatus()).toBe(200);
    expect(response.getBody()).toMatchObject({
      tournamentId: tournament.id,
      round
    });
  });

  test('A valid round has an ID generated', async () => {
    const route = new CreateRoundRoute(repo);

    const { id, ...round } = createRound();
    await route.route(requestWithRound(round), new Response());

    const dbModel = await repo.get(tournament.id);
    // $FlowFixMe
    expect(dbModel.rounds[0].id.length).toBeGreaterThan(0);
  });

  test('Error during creation returns status 500', async () => {
    // $FlowFixMe
    repo.createRound = () => {
      throw {};
    };
    const route = new CreateRoundRoute(repo);
    const response = new Response();

    await route.route(requestWithRound(createRound()), response);

    expect(response.getStatus()).toBe(500);
  });

  test('Returns status 401 if user does not own tournament', async () => {
    const otherTournament = {
      ...createTournament(),
      creatorId: generateId() // other user
    };
    await repo.create(otherTournament);

    const route = new CreateRoundRoute(repo);
    const response = new Response();

    const body = {
      tournamentId: otherTournament.id,
      round: createRound()
    };
    await route.route(Request.withBody(body), response);

    expect(response.getStatus()).toBe(401);
  });

  test('Returns status 404 if tournament does not exist', async () => {
    const route = new CreateRoundRoute(repo);
    const response = new Response();

    const body = {
      tournamentId: generateId(), // another tournament id
      round: createRound()
    };
    await route.route(Request.withBody(body), response);

    expect(response.getStatus()).toBe(404);
  });
});

function requestWithRound(round: mixed): ServerApiRequest {
  return Request.withBody({
    tournamentId: TOURNAMENT_ID,
    round: round
  });
}

// @flow

import route from '../create-assistant';
import {
  Request,
  Response,
  createTournament,
  createAdmin,
  TournamentRepositoryImpl as TournamentRepository,
  AccessKeyRepositoryImpl as AccessKeyRepository
} from '../../../test-utils';

describe('/api/assistant/create', () => {
  const admin = createAdmin();
  const tournament = { ...createTournament(), creatorId: admin._id.toString() };
  const name = 'name';

  let req: Request;
  let res: Response;
  let tournamentRepo: TournamentRepository;
  let accessRepo: AccessKeyRepository;

  beforeEach(async () => {
    req = Request.withUserAndParams(admin, { tournamentId: tournament.id });
    req.body = { name };
    res = new Response();
    tournamentRepo = new TournamentRepository();
    accessRepo = new AccessKeyRepository();
    await tournamentRepo.create(tournament);
  });

  test('Status 500 is returned if the assistant could not be created', async () => {
    tournamentRepo.addAssistant = () => {
      throw 'Test throw';
    };
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(500);
  });

  test('Status 200 is returned if assistant is added successfully', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(await tournamentRepo.get(tournament.id)).toMatchObject({
      ...tournament,
      assistants: [{ name }]
    });
  });

  test('Returns tournament id and assistant if successful', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toMatchObject({
      tournamentId: tournament.id,
      assistant: { name }
    });
  });

  test('Creates access key if successful', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    const assistant: Assistant = res.getBody().assistant;
    expect(accessRepo.getAll()).toMatchObject([
      {
        tournamentId: tournament.id,
        userId: assistant.id
      }
    ]);
  });

  test('Status 400 is returned if invalid assistant', async () => {
    req.body = { name: null };
    await route(tournamentRepo, accessRepo)(req, res);
    expect(res.getStatus()).toBe(400);
  });
});

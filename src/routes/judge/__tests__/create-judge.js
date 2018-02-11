// @flow

import route from '../create-judge';
import {
  Request,
  Response,
  createTournament,
  createAdmin,
  TournamentRepositoryImpl as TournamentRepository,
  AccessKeyRepositoryImpl as AccessKeyRepository
} from '../../../test-utils';

describe('/api/judge/create', () => {
  const admin = createAdmin();
  const tournament = { ...createTournament(), creatorId: admin._id.toString() };
  const name = 'Judge name';

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

  test('Status 500 is returned if the judge could not be added', async () => {
    tournamentRepo.addJudge = () => {
      throw 'Test throw';
    };
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(500);
  });

  test('Status 200 is returned if judge is added successfully', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(await tournamentRepo.get(tournament.id)).toMatchObject({
      ...tournament,
      judges: [{ name }]
    });
  });

  test('Returns tournament id and judge if successful', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toMatchObject({
      tournamentId: tournament.id,
      judge: { name }
    });
  });

  test('Creates access key if successful', async () => {
    await route(tournamentRepo, accessRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    // $FlowFixMe
    const judge: Judge = res.getBody().judge;
    expect(accessRepo.getAll()).toMatchObject([
      {
        tournamentId: tournament.id,
        userId: judge.id
      }
    ]);
  });

  test('Status 400 is returned if invalid judge', async () => {
    req.body = { name: null };
    await route(tournamentRepo, accessRepo)(req, res);
    expect(res.getStatus()).toBe(400);
  });
});

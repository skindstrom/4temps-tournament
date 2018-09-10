// @flow

import route from '../login';
import {
  Request,
  Response,
  createTournament,
  createJudge,
  AccessKeyRepositoryImpl as AccessKeyRepository
} from '../../../test-utils';

describe('/api/access-key/login', () => {
  const tournament = createTournament();
  const VALID_KEY = '1234567890';

  let req: Request;
  let res: Response;
  let accessKeyRepo: AccessKeyRepository;

  beforeEach(async () => {
    req = new Request();
    res = new Response();
    accessKeyRepo = new AccessKeyRepository();
  });

  test('returns user id and role on success', async () => {
    const judge = createJudge();
    accessKeyRepo._keys.push({
      userId: judge.id,
      tournamentId: tournament.id,
      key: VALID_KEY,
      role: 'judge'
    });

    req.body = { accessKey: VALID_KEY };
    await route(accessKeyRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual({ userId: judge.id, role: 'judge' });
  });

  test('sets user session variable to the role of the user if correct key', async () => {
    accessKeyRepo._keys.push({
      userId: 'assistantId',
      tournamentId: tournament.id,
      key: VALID_KEY,
      role: 'assistant'
    });
    req.body = { accessKey: VALID_KEY };
    await route(accessKeyRepo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect(req.session.user).toEqual({
      id: 'assistantId',
      role: 'assistant'
    });
  });

  test('returns isValidKey: false if invalid key', async () => {
    req.body = { accessKey: '123' };
    await route(accessKeyRepo)(req, res);

    expect(res.getStatus()).toBe(400);
    expect(res.getBody()).toEqual({ isValidKey: false });
  });

  test('returns doesAccessKeyExist: false if key does not exist', async () => {
    req.body = { accessKey: VALID_KEY };
    await route(accessKeyRepo)(req, res);

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ doesAccessKeyExist: false });
  });
});

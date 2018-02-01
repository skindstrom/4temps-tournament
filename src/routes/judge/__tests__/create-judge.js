// @flow

import route from '../create-judge';
import {
  Request, Response, createTournament, createUser,
  generateId,
  TournamentRepositoryImpl as TournamentRepository
} from '../../../test-utils';

describe('/api/judge/create', () => {
  const user = createUser();
  const tournament = {...createTournament(), creatorId: user._id};
  const judgeId = generateId().toString();

  let req: Request;
  let res: Response;
  let repo: TournamentRepository;

  beforeEach(async () => {
    req = Request.withUserAndParams(user, {tournamentId: tournament._id});
    req.body = {judgeId};
    res = new Response();
    repo = new TournamentRepository();
    await repo.create(tournament);
  });

  test('Status 500 is returned if the judge could not be added', async () => {
    repo.addJudge = () => {throw 'Test throw';};
    await route(repo)(req, res);

    expect(res.getStatus()).toBe(500);
  });

  test('Status 200 is returned if judge is added successfully', async () => {
    await route(repo)(req, res);

    expect(res.getStatus()).toBe(200);
    expect((await repo.get(tournament._id)))
      .toEqual({
        ...tournament,
        judges: [judgeId]
      });
  });
});

// @flow

import {
  Request, Response, generateId, createTournament,
  createUser,
  TournamentRepositoryImpl as TournamentRepository
} from '../../test-utils';
import {AuthorizationChecker} from '../auth-middleware';

describe('Authentication middleware', () => {
  describe('Allow Role', () => {
    const user = createUser();
    const tournamentId = generateId();

    let repo: TournamentRepository;
    let checker: AuthorizationChecker;
    let req: Request;
    let res: Response;

    beforeEach(async () => {
      res = new Response();
      repo = new TournamentRepository();
      req = Request.withUserAndParams(user, {tournamentId});

      await repo.create({
        ...createTournament,
        _id: tournamentId,
        creatorId: user._id
      });

      checker = new AuthorizationChecker(repo);
    });

    test('Calls next if public are allowed with tournamentId set', done => {
      checker.checkRole('public')(req, res, done);
    });

    test('Calls next if tournamentId param is not set and public are allowed',
      (done) => {
        checker.checkRole('public')(
          Request.withUserAndParams(user, {}), res, done);
      });

    test('Calls next if user is null and public are allowed',
      (done) => {
        checker.checkRole('public')(
          // $FlowFixMe
          Request.withUserAndParams(null, {}), res, done);
      });

    test('Calls next if user is set and authentication is required',
      (done) => {
        checker.checkRole('authenticated')(req, res, done);
      });

    test('Returns 401 is the user is null and authentication is required',
      async () => {
        // $FlowFixMe
        req = Request.withUserAndParams(null, {tournamentId});

        await checker.checkRole('authenticated')(req, res, () => {
          expect(true).toBe(false);
        });
        expect(res.getStatus()).toBe(401);
      });

    // eslint-disable-next-line
    test('Returns 401 is the user is null, and tournament does not exist and authentication is required',
      async () => {
        // $FlowFixMe
        req = Request.withUserAndParams(null, {tournamentId: null});

        await checker.checkRole('authenticated')(req, res, () => {
          expect(true).toBe(false);
        });
        expect(res.getStatus()).toBe(401);
      });

    test('Returns 401 if the user is not admin of tournament', async () => {
      req = Request.withUserAndParams({
        ...user,
        _id: generateId()
      }, {tournamentId});

      await checker.checkRole('admin')(req, res, () => {
        expect(true).toBe(false);
      });
      expect(res.getStatus()).toBe(401);
    });

    test('Returns 401 if user is null and admin is requested', async () => {
      // $FlowFixMe: Null on purpose
      req = Request.withUserAndParams(null, {tournamentId});

      await checker.checkRole('admin')(req, res, () => {
        expect(true).toBe(false);
      });
      expect(res.getStatus()).toBe(401);
    });

    test('Calls next if user is admin of tournament', (done) => {
      checker.checkRole('admin')(req, res, done);
    });

    test('404 is returned if tournament does not exist', async () => {
      req = Request.withUserAndParams(user, {tournamentId: generateId()});
      await checker.checkRole('admin')(
        req, res, () => expect(true).toBe(false));

      expect(res.getStatus()).toBe(404);
    });

    test('500 is returned if tournament could not be fetched', async () => {
      repo.get = () => {throw {};};
      await checker.checkRole('admin')(
        req, res, () => expect(true).toBe(false));

      expect(res.getStatus()).toBe(500);
    });
  });
});

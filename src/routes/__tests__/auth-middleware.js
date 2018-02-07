// @flow

import {
  Request, Response, generateId, createTournament,
  createAdmin,
  TournamentRepositoryImpl as TournamentRepository,
  createJudge
} from '../../test-utils';
import {authorizationMiddleware} from '../auth-middleware';

describe('Authentication middleware', () => {
  describe('Allow Role', () => {
    const admin = createAdmin();
    const tournamentId = generateId();

    let tournamentRepository: TournamentRepository;
    let req: Request;
    let res: Response;
    let allow;

    beforeEach(async () => {
      res = new Response();
      tournamentRepository = new TournamentRepository();
      req = Request.withUserAndParams(admin, {tournamentId});
      allow = authorizationMiddleware(tournamentRepository);

      await tournamentRepository.create({
        ...createTournament(),
        id: tournamentId,
        creatorId: admin._id.toString()
      });
    });

    describe('public', () => {
      test('Calls next if public are allowed with tournamentId set', done => {
        allow('public')(req, res, done);
      });

      test('Calls next if tournamentId param is not set and public are allowed',
        (done) => {
          allow('public')(
            Request.withUserAndParams(admin, {}), res, done);
        });

      test('Calls next if admin is null and public are allowed',
        (done) => {
          allow('public')(
            // $FlowFixMe
            Request.withUserAndParams(null, {}), res, done);
        });

    });

    describe('authenticated', () => {
      test('Calls next if admin is set and authentication is required',
        (done) => {
          allow('authenticated')(req, res, done);
        });

      test('Returns 401 is the admin is null and authentication is required',
        async () => {
          // $FlowFixMe
          req = Request.withUserAndParams(null, { tournamentId });

          await allow('authenticated')(req, res, () => {
            expect(true).toBe(false);
          });
          expect(res.getStatus()).toBe(401);
        });

      // eslint-disable-next-line
      test('Returns 401 is the admin is null, and tournament does not exist and authentication is required',
        async () => {
          // $FlowFixMe
          req = Request.withUserAndParams(null, { tournamentId: null });

          await allow('authenticated')(req, res, () => {
            expect(true).toBe(false);
          });
          expect(res.getStatus()).toBe(401);
        });


      test('Returns 401 if the authenticated user is not an admin',
        async (done) => {
          const judge: Judge = createJudge();
          req = Request.withJudgeAndParams(judge, { tournamentId });

          await allow('authenticated')(req, res, () => { });
          expect(res.getStatus()).toBe(401);
          done();
        });

    });

    describe('admin', () => {
      test('Returns 401 if the admin is not admin of tournament', async () => {
        req = Request.withUserAndParams({
          ...admin,
          _id: generateId()
        }, { tournamentId });

        await allow('admin')(req, res, () => {
          expect(true).toBe(false);
        });
        expect(res.getStatus()).toBe(401);
      });

      test('Returns 401 if admin is null and admin is requested', async () => {
        // $FlowFixMe: Null on purpose
        req = Request.withUserAndParams(null, { tournamentId });

        await allow('admin')(req, res, () => {
          expect(true).toBe(false);
        });
        expect(res.getStatus()).toBe(401);
      });

      test('Calls next if admin is admin of tournament', (done) => {
        allow('admin')(req, res, done);
      });

      test('404 is returned if tournament does not exist', async () => {
        req = Request.withUserAndParams(admin, { tournamentId: generateId() });
        await allow('admin')(
          req, res, () => expect(true).toBe(false));

        expect(res.getStatus()).toBe(404);
      });

      test('500 is returned if tournament could not be fetched', async () => {
        tournamentRepository.get = () => { throw {}; };
        await allow('admin')(
          req, res, () => expect(true).toBe(false));

        expect(res.getStatus()).toBe(500);
      });


    });

    describe('judge', () => {
      test('Judge is not allowed if the judge is not part of the tournament',
        async (done) => {
          const judge = createJudge();
          req = Request.withJudgeAndParams(judge, { tournamentId });
          await allow('judge')(req, res, () => {});
          expect(res.getStatus()).toBe(401);
          done();
        });

      test('Judge is allowed if the judge is part of the tournament',
        async (done) => {
          const judge = createJudge();
          const tournament = { ...createTournament(), id: generateId() };
          await tournamentRepository.create(tournament);
          await tournamentRepository.addJudge(tournament.id, judge);

          req =
            Request.withJudgeAndParams(judge, { tournamentId: tournament.id });
          await allow('judge')(req, res, done);
        });
    });
  });
});

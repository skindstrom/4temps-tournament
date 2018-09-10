// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';

import {
  Request,
  Response,
  createAdmin,
  generateId,
  createRound,
  createTournament,
  createJudge,
  TournamentRepositoryImpl,
  createParticipant,
  AccessKeyRepositoryImpl
} from '../test-utils';
import validateAdmin from '../validators/validate-admin';
import validateRound from '../validators/validate-round';
import validateTournament from '../validators/validate-tournament';

describe('Round route test helpers', () => {
  test('Generate ID generates a valid object id', () => {
    expect(ObjectId.isValid(generateId())).toBe(true);
  });

  test('createAdmin creates a valid admin', async () => {
    expect((await validateAdmin(createAdmin())).isValid).toBe(true);
  });

  test('createRound creates a valid round', () => {
    // $FlowFixMe
    expect(validateRound(createRound()).isValidRound).toBe(true);
  });

  test('createTournament creates a valid tournament', () => {
    let tournament = createTournament();
    tournament = { ...tournament, date: moment(tournament.date) };
    // $FlowFixMe
    expect(validateTournament(tournament).isValidTournament).toBe(true);
  });

  test('createJudge creates a valid judge', () => {
    const judge = createJudge();
    expect(judge.id).not.toBeNull();
    expect(judge.name).not.toBeNull();
  });

  test('createJudge generates new id for each', () => {
    const j1 = createJudge();
    const j2 = createJudge();

    expect(j1).not.toEqual(j2);
  });

  describe('Request helpers', () => {
    const body = { test: 'body' };
    const query = { test: 'query' };
    const params = { test: 'params' };
    const admin = createAdmin();
    const expectedUser = { id: admin._id.toString(), role: 'admin' };

    test('Request create with body sets body and default user', async () => {
      const req = Request.withBody(body);

      expect(req.body).toEqual(body);
      expect(req.session.user).toEqual(expectedUser);
    });

    test('Request create with userAndBody sets body and user', () => {
      const req = Request.withUserAndBody(admin, body);

      expect(req.body).toEqual(body);
      expect(req.session.user).toEqual(expectedUser);
    });

    test('Request create with query sets query and default user', async () => {
      const req = Request.withQuery(query);

      expect(req.query).toEqual(query);
      expect(req.session.user).toEqual(expectedUser);
    });

    test('Request create with userAndQuery sets query and user', () => {
      const req = Request.withUserAndQuery(admin, query);

      expect(req.query).toEqual(query);
      expect(req.session.user).toEqual(expectedUser);
    });

    test('Request create with params sets params and default user', async () => {
      const req = Request.withParams(params);

      expect(req.params).toEqual(params);
      expect(req.session.user).toEqual(expectedUser);
    });

    test('Request create with userAndParams sets params and user', () => {
      const req = Request.withUserAndParams(admin, params);

      expect(req.params).toEqual(params);
      expect(req.session.user).toEqual(expectedUser);
    });
  });

  describe('Response helpers', () => {
    test('sendStatus sets status', () => {
      const res = new Response();
      res.sendStatus(123);
      expect(res.getStatus()).toBe(123);
    });

    test('json sets status to 200 and body', () => {
      const res = new Response();
      const body = { test: 'sweet' };
      res.json(body);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(body);
    });
  });

  describe('Tournament repository', () => {
    let repo: TournamentRepositoryImpl;

    beforeEach(() => {
      repo = new TournamentRepositoryImpl();
    });

    test('Get returns the tournament with the given id if exists', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      expect(await repo.get(tournament.id)).toEqual(tournament);
    });

    test('Get returns null if the tournament does not exist', async () => {
      expect(await repo.get('a very nice id')).toBeNull();
    });

    test('getAll returns all tournaments', async () => {
      const create = async () => {
        const tour = {
          ...createTournament(),
          id: generateId(),
          creatorId: generateId()
        };
        await repo.create(tour);
        return tour;
      };

      const t1 = await create();
      const t2 = await create();

      expect(await repo.getAll()).toEqual([t1, t2]);
    });

    test('getForUser returns only a users tournaments ', async () => {
      const creatorId = generateId();
      const t1 = {
        ...createTournament(),
        creatorId,
        id: generateId()
      };
      const t2 = {
        ...createTournament(),
        creatorId: generateId(),
        id: generateId()
      };

      await repo.create(t1);
      await repo.create(t2);

      expect(await repo.getForUser(creatorId)).toEqual([t1]);
    });

    test('Update sets the new values', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const newTournament = { ...tournament, name: 'a very cool name' };
      await repo.update(newTournament);

      expect(await repo.get(newTournament.id)).toEqual(newTournament);
    });

    test('Create participant adds participant', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const participant = createParticipant();
      await repo.createParticipant(tournament.id, participant);

      expect(await repo.get(tournament.id)).toEqual({
        ...tournament,
        participants: [participant]
      });
    });

    test('Create round adds round', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const round = createRound();
      await repo.createRound(tournament.id, round);

      expect(await repo.get(tournament.id)).toEqual({
        ...tournament,
        rounds: [round]
      });
    });

    test('Delete round deletes round', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const round = { ...createRound(), id: 'special id' };
      await repo.createRound(tournament.id, round);
      await repo.deleteRound(tournament.id, round.id);

      expect(await repo.get(tournament.id)).toEqual({
        ...tournament,
        rounds: []
      });
    });

    test('Add judge adds a judge', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const judge = { name: 'nice name', id: '123' };
      await repo.addJudge(tournament.id, judge);

      expect(await repo.get(tournament.id)).toEqual({
        ...tournament,
        judges: [judge]
      });
    });

    test('Add assistant adds an assistant', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const assistant = { name: 'nice name', id: '123' };
      await repo.addAssistant(tournament.id, assistant);

      expect(await repo.get(tournament.id)).toEqual({
        ...tournament,
        assistants: [assistant]
      });
    });
  });

  describe('AccessKey repository', () => {
    const userId = generateId();
    const tournamentId = generateId();

    test('Create adds key', async () => {
      const repo = new AccessKeyRepositoryImpl();
      await repo.createForTournamentAndUserWithRole(
        tournamentId,
        userId,
        'judge'
      );

      expect(repo.getAll()).toHaveLength(1);
      expect(repo.getAll()[0]).toMatchObject({ tournamentId, userId });
    });

    test('Creates unique keys', async () => {
      const repo = new AccessKeyRepositoryImpl();
      await repo.createForTournamentAndUserWithRole(
        tournamentId,
        userId,
        'judge'
      );
      await repo.createForTournamentAndUserWithRole(
        tournamentId,
        userId,
        'judge'
      );

      const keys = repo.getAll();
      expect(keys[0]).not.toEqual(keys[1]);
    });

    test('Get for key only returns the matching object', async () => {
      const repo = new AccessKeyRepositoryImpl();
      await repo.createForTournamentAndUserWithRole(
        tournamentId,
        userId,
        'judge'
      );
      await repo.createForTournamentAndUserWithRole(
        tournamentId,
        generateId(),
        'judge'
      );

      const expected = repo.getAll()[0];
      expect(await repo.getForKey(expected.key)).toMatchObject(expected);
    });
  });
});

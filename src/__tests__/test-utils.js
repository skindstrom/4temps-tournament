// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';

import {
  Request, Response, createUser, generateId, createRound, createTournament,
  TournamentRepositoryImpl, createParticipant
} from '../test-utils';
import validateUser from '../validators/validate-user';
import validateRound from '../validators/validate-round';
import validateTournament from '../validators/validate-tournament';

describe('Round route test helpers', () => {

  test('Generate ID generates a valid object id', () => {
    expect(ObjectId.isValid(generateId())).toBe(true);
  });

  test('createUser creates a valid user', async () => {
    expect((await validateUser(createUser())).isValid).toBe(true);
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

  describe('Request helpers', () => {
    let body = { test: 'body' };
    let query = { test: 'query' };
    let params = {test: 'params'};
    let user = createUser();


    test('Request create with body sets body and default user', async () => {
      const req = Request.withBody(body);

      expect(req.body).toEqual(body);
      expect(req.session.user).toEqual(user);
    });

    test('Request create with userAndBody sets body and user', () => {
      const req = Request.withUserAndBody(user, body);

      expect(req.body).toEqual(body);
      expect(req.session.user).toEqual(user);
    });

    test('Request create with query sets query and default user', async () => {
      const req = Request.withQuery(query);

      expect(req.query).toEqual(query);
      expect(req.session.user).toEqual(user);
    });

    test('Request create with userAndQuery sets query and user', () => {
      const req = Request.withUserAndQuery(user, query);

      expect(req.query).toEqual(query);
      expect(req.session.user).toEqual(user);
    });

    test('Request create with params sets params and default user',
      async () => {
        const req = Request.withParams(params);

        expect(req.params).toEqual(params);
        expect(req.session.user).toEqual(user);
      });

    test('Request create with userAndparams sets params and user', () => {
      const req = Request.withUserAndParams(user, params);

      expect(req.params).toEqual(params);
      expect(req.session.user).toEqual(user);
    });
  });

  describe('Response helpers', () => {
    const res = new Response();

    test('sendStatus sets status', () => {
      res.sendStatus(123);
      expect(res.getStatus()).toBe(123);
    });

    test('json sets status to 200 and body', () => {
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

      expect(await repo.get(tournament._id)).toEqual(tournament);
    });

    test('Get returns null if the tournament does not exist', async () => {
      expect(await repo.get('a very nice id')).toBeNull();
    });

    test('getAll returns all tournaments', async () => {
      const create = async () => {
        const tour = {
          ...createTournament(),
          _id: generateId().toString(),
          creatorId: generateId.toString()
        };
        await repo.create(tour);
        return tour;
      };

      const t1 = await create();
      const t2 = await create();

      expect(await repo.getAll()).toEqual([t1, t2]);
    });

    test('getForUser returns only a users tournaments ', async () => {
      const creatorId = generateId().toString();
      const t1 = {
        ...createTournament(),
        creatorId,
        _id: generateId().toString()
      };
      const t2 = {
        ...createTournament(),
        creatorId: generateId().toString(),
        _id: generateId().toString()
      };

      await repo.create(t1);
      await repo.create(t2);

      expect(await repo.getForUser(creatorId)).toEqual([t1]);
    });

    test('Update sets the new values', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const newTournament = {...tournament, name: 'a very cool name'};
      await repo.update(newTournament);

      expect(await repo.get(newTournament._id)).toEqual(newTournament);
    });

    test('Create participant adds participant', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const participant = createParticipant();
      await repo.createParticipant(tournament._id, participant);

      expect(await repo.get(tournament._id))
        .toEqual({...tournament, participants: [participant]});
    });

    test('Create round adds round', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const round = createRound();
      await repo.createRound(tournament._id, round);

      expect(await repo.get(tournament._id))
        .toEqual({...tournament, rounds: [round]});
    });

    test('Delete round deletes round', async () => {
      const tournament = createTournament();
      await repo.create(tournament);

      const round = {...createRound(), _id: 'special id'};
      await repo.createRound(tournament._id, round);
      await repo.deleteRound(tournament._id, round._id);

      expect(await repo.get(tournament._id))
        .toEqual({...tournament, rounds: []});
    });
  });
});

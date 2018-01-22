// @flow

import ObjectId from 'bson-objectid';
import moment from 'moment';

import {
  Request, Response, createUser, generateId, createRound, createTournament,
  RoundRepositoryImpl, TournamentRepositoryImpl, TOURNAMENT_ID
} from '../test-utils';
import validateUser from '../../../validators/validate-user';
import validateRound from '../../../validators/validate-round';
import validateTournament from '../../../validators/validate-tournament';

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
  });

  describe('Response helpers', () => {
    const res = new Response();

    test('sendStatus sets status', () => {
      res.sendStatus(123);
      expect(res.status).toBe(123);
    });

    test('json sets status to 200 and body', () => {
      const body = { test: 'sweet' };
      res.json(body);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(body);
    });
  });

  describe('Tournament repository', () => {
    let repo: TournamentRepositoryImpl;

    beforeEach(() => {
      repo = new TournamentRepositoryImpl();
    });

    test('Get returns the tournament with the given id if exists', async () => {
      const tournament = createTournament();
      const id = tournament._id.toString();
      repo.tournaments[id] = tournament;

      expect(await repo.get(id)).toEqual(tournament);
    });

    test('Get returns null if the tournament does not exist', async () => {
      expect(await repo.get('a very nice id')).toBeNull();
    });

    test('Create adds the tournaments', async () => {
      const tournament = createTournament();
      const id = tournament._id.toString();

      repo.create(tournament);

      expect(await repo.get(id)).toEqual(tournament);
      expect(repo.tournaments[id]).toEqual(tournament);
    });
  });

  describe('Round repository', () => {
    let repo: RoundRepositoryImpl;

    beforeEach(() => { repo = new RoundRepositoryImpl(); });

    test('Get with empty repo returns empty array', async () => {
      expect(await repo.getForTournament(generateId().toString)).toEqual([]);
    });

    test('Create adds a round', async () => {
      const round = createRound();
      const id = TOURNAMENT_ID.toString();
      repo.create(id, round);

      expect(repo._rounds[id]).toEqual([round]);
    });

    test('Get for tournament returns only rounds for a specific tournament',
      async () => {
        const id1 = generateId();
        const id2 = generateId();
        const round1 = createRound();
        const round2 = createRound();

        repo.create(id1, round1);
        repo.create(id2, round2);


        expect(await repo.getForTournament(id1))
          .toEqual([round1]);
        expect(await repo.getForTournament(id2))
          .toEqual([round2]);
      });
  });
});

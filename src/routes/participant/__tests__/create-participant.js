// @flow

import { Types } from 'mongoose';
import { CreateParticipantRoute } from '../create-participant';
import type { ParticipantRepository } from '../../../data/participant';
import type { Participant } from '../../../models/participant';

const USER_ID = new Types.ObjectId();
const user = {
  _id: USER_ID,
  email: 'test@gmail.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'password'
};

const TOURNAMENT_ID = new Types.ObjectId();

const VALID_BODY = {
  tournamentId: TOURNAMENT_ID.toString(), participant: {
    name: 'Test User',
    role: 'leader'
  }
};

const getTournament =
  (id: string) => new Promise(resolve => {
    if (id === TOURNAMENT_ID.toString()) {
      resolve({
        _id: TOURNAMENT_ID,
        userId: USER_ID,
        name: '',
        date: new Date(),
        type: 'jj'
      });
    } else {
      resolve(null);
    }
  });

class Repository implements ParticipantRepository {
  // eslint-disable-next-line no-unused-vars
  createForTournament(tournamentId: string, participant: Participant) {
    return new Promise(resolve => resolve());
  }

  // eslint-disable-next-line no-unused-vars
  async getForTournament(tournamentId: string) { return []; }
}

test('Valid participant and tournament has status 200', async () => {
  const route =
    new CreateParticipantRoute(USER_ID.toString(),
      getTournament, new Repository());

  route.parseBody(VALID_BODY);

  await route.createParticipant();
  expect(route.status).toBe(200);
});

test('Invalid participant has status 400', async () => {
  const route =
    new CreateParticipantRoute(user.toString(),
      getTournament, new Repository());

  route.parseBody({
    tournamentId: TOURNAMENT_ID.toString(),
    participant: null
  });
  await route.createParticipant();
  expect(route.status).toBe(400);
});

test('Wrong user has status 401', async () => {
  const otherUserId = new Types.ObjectId().toString();
  const route =
    new CreateParticipantRoute(otherUserId,
      getTournament, new Repository());

  route.parseBody(VALID_BODY);
  await route.createParticipant();
  expect(route.status).toBe(401);
});

test('Null tournament has status 400', async () => {
  const route =
    new CreateParticipantRoute(USER_ID.toString(),
      () => new Promise(resolve => resolve(null)), new Repository());

  route.parseBody(VALID_BODY);
  await route.createParticipant();
  expect(route.status).toBe(404);
});
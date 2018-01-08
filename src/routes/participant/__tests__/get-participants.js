// @flow
import mongoose from 'mongoose';

import { GetParticipantsRoute } from '../get-participants';
import type { ParticipantRepository } from '../../../data/participant';
import type { Participant } from '../../../models/participant';

const userId = new mongoose.Types.ObjectId();
const tournamentId = new mongoose.Types.ObjectId();

const dbParticipants = [
  {
    _id: new mongoose.Types.ObjectId(),
    tournamentId,
    name: 'Participant Name',
    role: 'leader'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    tournamentId,
    name: 'Another Participant',
    role: 'follower'
  }
];

const participants =
  dbParticipants.map(({ _id, name, role }) =>
    ({ _id: _id.toString(), name, role }));

class Repository implements ParticipantRepository {
  async createForTournament(tournamentId: string,
    // eslint-disable-next-line no-unused-vars
    participant: Participant) {
    return;
  }

  async getForTournament(id: string) {
    if (id === tournamentId.toString()) {
      return dbParticipants;
    }
    return [];
  }
}


test('Unauthorized user results in no participants and status 401',
  async () => {
    const getTournament =
      () => new Promise(resolve => resolve({
        _id: tournamentId,
        name: 'Tournament name',
        userId: new mongoose.Types.ObjectId(), // another user id
        type: 'jj',
        date: new Date()
      }));
    const route = new GetParticipantsRoute(userId.toString(),
      new Repository(), getTournament);

    expect(await route.getParticipantsForTournament(tournamentId.toString()))
      .toEqual([]);
    expect(route.status).toBe(401);
  });

test('Valid user returns the participants with status 200', async () => {
  const tournament = {
    _id: tournamentId,
    name: 'Tournament name',
    userId,
    type: 'jj',
    date: new Date()
  };

  const getTournament =
    () => new Promise(resolve => resolve(tournament));

  const route = new GetParticipantsRoute(userId.toString(),
    new Repository(), getTournament);

  expect(await route.getParticipantsForTournament(tournamentId.toString()))
    .toEqual(participants);
  expect(route.status).toBe(200);
});
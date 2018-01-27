// @flow
import moment from 'moment';
import { Types } from 'mongoose';

import { createTournamentRoute } from '../create-tournament';
import type { Tournament } from '../../../models/tournament';

test('Valid tournament returns 200 and the new tournamentid', async () => {
  const userId = '1';

  const tournamentId = new Types.ObjectId();
  const tournament: Tournament = {
    _id: tournamentId.toString(),
    name: 'best',
    date: moment(),
    type: 'classic',
    judges: [],
    creatorId: ''
  };

  const createTournament = () => new Promise(resolve => resolve(tournamentId));

  expect(await createTournamentRoute(userId, tournament, createTournament))
    .toEqual({
      status: 200,
      body: {
        ...tournament
      }
    });
});

test('Tournament is validated and returns status 400 when invalid',
  async () => {
    const tournament: Tournament = {
      _id: '',
      name: '',
      date: moment(),
      type: 'classic',
      judges: [],
      creatorId: ''
    };

    const createTournament = () => new Promise(resolve => resolve(null));

    expect(await createTournamentRoute('', tournament, createTournament))
      .toEqual({
        status: 400,
        body: null
      });
  });

test('Returns status 500 when a valid tournament can not be created',
  async () => {
    const tournament: Tournament = {
      _id: '',
      name: 'best',
      date: moment(),
      type: 'classic',
      judges: [],
      creatorId: ''
    };
    const createTournament = () =>
      new Promise((resolve, reject) => reject(null));

    expect(await createTournamentRoute('', tournament, createTournament))
      .toEqual({
        status: 500,
        body: null
      });
  });

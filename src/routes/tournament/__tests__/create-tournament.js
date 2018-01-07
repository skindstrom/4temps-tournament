// @flow
import moment from 'moment';
import { Types } from 'mongoose';

import { createTournamentRoute } from '../create-tournament';
import type { Tournament } from '../../../models/tournament';

test('Valid tournament returns 200 and the new tournament id', async () => {
  const userId = '1';
  const tournament: Tournament = {
    _id: '',
    name: 'best',
    date: moment(),
    type: 'classic'
  };
  const tournamentId = new Types.ObjectId();

  const createTournament = () => new Promise(resolve => resolve(tournamentId));

  expect(await createTournamentRoute(userId, tournament, createTournament))
    .toMatchObject({
      status: 200,
      body: {
        tournamentId: tournamentId.toString(),
      }
    });
});

test('Tournament is validated and returns status 400 when invalid',
  async () => {
    const tournament: Tournament = {
      _id: '',
      name: '',
      date: moment(),
      type: 'classic'
    };

    const createTournament = () => new Promise(resolve => resolve(null));

    expect(await createTournamentRoute('', tournament, createTournament))
      .toMatchObject({
        status: 400,
        body: {
          validation: {
            isValidTournament: false,
            isValidName: false,
            isValidDate: true,
            isValidType: true
          }
        }
      });
  });

test('Returns status 500 when a valid tournament can not be created',
  async () => {
    const tournament: Tournament = {
      _id: '',
      name: 'best',
      date: moment(),
      type: 'classic'
    };
    const createTournament = () => new Promise(resolve => resolve(null));

    expect(await createTournamentRoute('', tournament, createTournament))
      .toMatchObject({
        status: 500,
        body: {
          tournamentId: null
        }
      });
  });
// @flow
import moment from 'moment';
import { Types } from 'mongoose';

import { getTournamentRoute } from '../get-tournament';
import type { Tournament } from '../../../models/tournament';
import type { TournamentModel } from '../../../data/tournament';

test('Existing tournament is returned with status 200 if user created it',
  async () => {
    const userId = new Types.ObjectId();
    const tournamentId = new Types.ObjectId();

    const dbTournament: TournamentModel = {
      _id: tournamentId,
      name: 'Best Tournament',
      date: moment().toDate(),
      type: 'jj',
      userId
    };

    const tournament: Tournament = {
      name: dbTournament.name,
      date: moment(dbTournament.date),
      type: dbTournament.type
    };

    const getTournament = (id: string) => {
      return new Promise(resolve => {
        if (id === tournamentId.toString()) {
          resolve(dbTournament);
        } else {
          resolve(null);
        }
      });
    };

    expect(await getTournamentRoute(
      tournamentId.toString(),
      userId.toString(), getTournament))
      .toEqual({
        status: 200,
        body: tournament
      });
  });

test('Returns 404 and null tournament if tournament does not exist',
  async () => {
    const getTournament = () => new Promise(resolve => resolve(null));

    expect(await getTournamentRoute('', '', getTournament))
      .toEqual({
        status: 404,
        body: null
      });
  });

test('Returns 401 and null tournament if tournament was not created by user',
  async () => {
    const userId = '';
    const tournamentId = new Types.ObjectId();

    const dbTournament: TournamentModel = {
      _id: tournamentId,
      name: 'Best Tournament',
      date: moment().toDate(),
      type: 'jj',
      userId: new Types.ObjectId()
    };

    const getTournament = () => new Promise(resolve => resolve(dbTournament));

    expect(await getTournamentRoute(
      tournamentId.toString(),
      userId, getTournament))
      .toEqual({
        status: 401,
        body: null
      });
  });
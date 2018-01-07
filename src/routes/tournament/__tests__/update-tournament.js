// @flow
import moment from 'moment';
import { Types } from 'mongoose';

import { updateTournamentRoute } from '../update-tournament';
import type { Tournament } from '../../../models/tournament';
import type { TournamentModel } from '../../../data/tournament';

const nullPromise = () => new Promise(resolve => resolve(null));

test(
  'Valid tournament with correct user returns new tournament with status 200',
  async () => {
    const userId = new Types.ObjectId();
    const tournamentId = new Types.ObjectId();

    const dbTournament: TournamentModel = {
      _id: tournamentId,
      name: 'best',
      date: moment().toDate(),
      type: 'jj',
      userId
    };

    const tournament: Tournament = {
      _id: tournamentId.toString(),
      name: dbTournament.name,
      date: moment(dbTournament.date),
      type: dbTournament.type
    };


    const getTournament = (id: string) => {
      if (id === tournamentId.toString()) {
        return new Promise(resolve => resolve(dbTournament));
      } else {
        return new Promise(resolve => resolve(null));
      }
    };

    const updateTournament = () =>
      new Promise(resolve => resolve(dbTournament));

    expect(
      await updateTournamentRoute(
        userId.toString(),
        tournamentId.toString(),
        tournament,
        getTournament,
        updateTournament))
      .toMatchObject({
        status: 200,
        body: {
          tournament
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

    expect(
      await updateTournamentRoute('', '', tournament, nullPromise, nullPromise))
      .toMatchObject({
        status: 400,
        body: {
          tournament: null,
          validation: {
            isValidTournament: false,
            isValidName: false,
            isValidDate: true,
            isValidType: true
          }
        }
      });
  });

test(`Tournament that doesn't exist returns 404`, async () => {
  const tournament: Tournament = {
    _id: '',
    name: 'valid',
    date: moment(),
    type: 'classic'
  };

  expect(
    await updateTournamentRoute('', '', tournament, nullPromise, nullPromise))
    .toMatchObject({
      status: 404,
    });
});

test(`When tournament can't be updated 500 is returned`, async () => {
  const userId = new Types.ObjectId();
  const tournamentId = new Types.ObjectId();

  const dbTournament: TournamentModel = {
    _id: tournamentId,
    name: 'best',
    date: moment().toDate(),
    type: 'jj',
    userId
  };

  const tournament: Tournament = {
    _id: tournamentId.toString(),
    name: dbTournament.name,
    date: moment(dbTournament.date),
    type: dbTournament.type
  };


  const getTournament = (id: string) => {
    if (id === tournamentId.toString()) {
      return new Promise(resolve => resolve(dbTournament));
    } else {
      return new Promise(resolve => resolve(null));
    }
  };

  expect(
    await updateTournamentRoute(
      userId.toString(),
      tournamentId.toString(),
      tournament,
      getTournament,
      nullPromise))
    .toMatchObject({
      status: 500
    });
});

test(`When tournament is owned by other user be updated 401 is returned`,
  async () => {
    const userId = new Types.ObjectId();
    const tournamentId = new Types.ObjectId();

    const dbTournament: TournamentModel = {
      _id: tournamentId,
      name: 'best',
      date: moment().toDate(),
      type: 'jj',
      userId: new Types.ObjectId()
    };

    const tournament: Tournament = {
      _id: tournamentId.toString(),
      name: dbTournament.name,
      date: moment(dbTournament.date),
      type: dbTournament.type
    };


    const getTournament = (id: string) => {
      if (id === tournamentId.toString()) {
        return new Promise(resolve => resolve(dbTournament));
      } else {
        return new Promise(resolve => resolve(null));
      }
    };

    expect(
      await updateTournamentRoute(
        userId.toString(),
        tournamentId.toString(),
        tournament,
        getTournament,
        nullPromise))
      .toMatchObject({
        status: 401
      });
  });
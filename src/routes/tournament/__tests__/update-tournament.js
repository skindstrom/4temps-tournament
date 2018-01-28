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
    const creatorId = new Types.ObjectId();
    const tournamentId = new Types.ObjectId();

    const dbTournament: TournamentModel = {
      _id: tournamentId,
      name: 'best',
      date: moment().toDate(),
      type: 'jj',
      creatorId,
      judges: []
    };

    const tournament: Tournament = {
      _id: tournamentId.toString(),
      name: dbTournament.name,
      date: moment(dbTournament.date),
      type: dbTournament.type,
      judges: [],
      creatorId: creatorId.toString()
    };

    const getTournament = (id: string) => {
      if (id === tournamentId.toString()) {
        return new Promise(resolve => resolve(tournament));
      } else {
        return new Promise(resolve => resolve(null));
      }
    };

    const updateTournament = () =>
      new Promise(resolve => resolve(dbTournament));

    expect(
      await updateTournamentRoute(
        creatorId.toString(),
        tournamentId.toString(),
        tournament,
        getTournament,
        updateTournament))
      .toEqual({
        status: 200,
        body: tournament
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

    expect(
      await updateTournamentRoute('', '', tournament, nullPromise, nullPromise))
      .toEqual({
        status: 400,
        body: null
      });
  });

test(`Tournament that doesn't exist returns 404`, async () => {
  const tournament: Tournament = {
    _id: '',
    name: 'valid',
    date: moment(),
    type: 'classic',
    judges: [],
    creatorId: ''
  };

  expect(
    await updateTournamentRoute('', '', tournament, nullPromise, nullPromise))
    .toEqual({
      status: 404,
      body: null
    });
});

test(`When tournament can't be updated 500 is returned`, async () => {
  const creatorId = new Types.ObjectId().toString();
  const tournamentId = new Types.ObjectId().toString();

  const tournament: Tournament = {
    _id: tournamentId,
    name: 'best',
    date: moment(),
    type: 'jj',
    creatorId,
    judges: []
  };


  const getTournament = (id: string) => {
    if (id === tournamentId.toString()) {
      return new Promise(resolve => resolve(tournament));
    } else {
      return new Promise(resolve => resolve(null));
    }
  };

  expect(
    await updateTournamentRoute(
      tournament.creatorId,
      tournament._id,
      tournament,
      getTournament,
      nullPromise))
    .toEqual({
      status: 500,
      body: null
    });
});

test(`When tournament is owned by other user be updated 401 is returned`,
  async () => {
    const creatorId = new Types.ObjectId().toString();
    const tournamentId = new Types.ObjectId().toString();

    const tournament: Tournament = {
      _id: tournamentId,
      name: 'best',
      date: moment(),
      type: 'jj',
      creatorId: new Types.ObjectId().toString(),
      judges: []
    };


    const getTournament = (id: string) => {
      if (id === tournamentId.toString()) {
        return new Promise(resolve => resolve(tournament));
      } else {
        return new Promise(resolve => resolve(null));
      }
    };

    expect(
      await updateTournamentRoute(
        creatorId.toString(),
        tournamentId.toString(),
        tournament,
        getTournament,
        nullPromise))
      .toEqual({
        status: 401,
        body: null
      });
  });

// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import type { RouteResult } from '../util';
import { getTournament } from '../../data/tournament';
import type { Tournament } from '../../models/tournament';
import type { TournamentModel } from '../../data/tournament';

export const getTournamentRoute = async (tournamentId: string,
  userId: string,
  getTournament: (tournamentId: string)
    => Promise<?TournamentModel>): RouteResult<?Tournament> => {

  const dbTournament = await getTournament(tournamentId);

  if (dbTournament == null) {
    return { status: 404, body: null };
  } else if (dbTournament.userId.toString() != userId) {
    return { status: 401, body: null };
  }

  return {
    status: 200,
    body: {
      name: dbTournament.name,
      date: moment(dbTournament.date),
      type: dbTournament.type
    }
  };
};

export default async (req: $Request, res: $Response) => {
  const tournamentId = req.params.tournamentId;
  // $FlowFixMe
  const userId: string = req.session.user._id;

  const { status, body } =
    await getTournamentRoute(tournamentId, userId, getTournament);

  res.status(status);
  res.json(body);
};
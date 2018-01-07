// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import { getTournament, updateTournament } from '../../data/tournament';
import type { RouteResult } from '../util';
import type { TournamentModel } from '../../data/tournament';

export const updateTournamentRoute = async (
  userId: string,
  tournamentId: string,
  tournament: Tournament,
  getTournament: (tournamentId: string) => Promise<?TournamentModel>,
  updateTournament: (tournamentId: string, tournament: Tournament)
    => Promise<?TournamentModel>): RouteResult<?Tournament> => {

  const { isValidTournament } = validateTournament(tournament);
  let status: number = 200;
  if (isValidTournament) {
    const dbTournament = await getTournament(tournamentId);

    if (dbTournament == null) {
      status = 404;
    }
    else if (dbTournament.userId.toString() != userId) {
      status = 401;
    } else {
      if (await updateTournament(tournamentId, tournament) == null) {
        status = 500;
      }
    }
  } else {
    status = 400;
  }

  const body = status === 200 ? tournament : null;

  return { status, body };
};

export default async (req: $Request, res: $Response) => {
  const tournament: Tournament = {
    _id: req.body.tournament._id || '',
    name: req.body.tournament.name || '',
    date: moment(req.body.tournament.date) || moment(0),
    type: req.body.tournament.type || 'none'
  };

  // $FlowFixMe
  const userId: string = req.session.user._id;
  const tournamentId: string = req.body.tournamentId || '';

  const { status, body } =
    await updateTournamentRoute(userId, tournamentId, tournament,
      getTournament, updateTournament);

  res.status(status);
  res.json(body);
};
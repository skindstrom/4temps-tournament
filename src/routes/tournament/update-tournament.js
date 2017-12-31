// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import { getTournament, updateTournament } from '../../data/tournament';

export default async (req: $Request, res: $Response) => {
  const tournament: Tournament = {
    name: req.body.tournament.name || '',
    date: moment(req.body.tournament.date) || moment(0),
    type: req.body.tournament.type || 'none'
  };

  // $FlowFixMe
  const userId: string = req.session.user._id;

  let result = {
    validation: validateTournament(tournament),
    tournament: (null: ?Tournament)
  };
  let status: number = 200;
  if (result.validation.isValidTournament) {
    const tournamentId = req.body.tournamentId || '';
    const dbTournament = await getTournament(tournamentId);

    if (dbTournament == null) {
      status = 404;
    }
    else if (dbTournament.userId.toString() != userId) {
      status = 401;
    } else {
      if (await updateTournament(tournamentId, tournament) == null) {
        status = 500;
      } else {
        result.tournament = tournament;
      }
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json(result);
};
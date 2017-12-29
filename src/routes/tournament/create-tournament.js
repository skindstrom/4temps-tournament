// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import { createTournament } from '../../data/tournament';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user == null) {
    res.sendStatus(401);
    return;
  }

  const tournament: Tournament = {
    name: req.body.name || '',
    date: moment(req.body.date) || moment(0),
    type: req.body.type || 'none'
  };

  let result = {
    validation: validateTournament(tournament),
    tournamentId: null
  };
  let status: number = 200;
  if (result.validation.isValidTournament) {
    result.tournamentId =
      // $FlowFixMe
      await createTournament(req.session.user._id, tournament);
    if (result.tournamentId == null) {
      status = 500;
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json(result);
};
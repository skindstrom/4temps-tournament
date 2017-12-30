// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import { getTournament } from '../../data/tournament';

export default async (req: $Request, res: $Response) => {
  const dbTournament = await getTournament(req.params.tournamentId);

  if (dbTournament == null) {
    res.sendStatus(404);
    return;
  }

  // $FlowFixMe
  if (dbTournament.userId.toString() !== req.session.user._id) {
    res.sendStatus(401);
    return;
  }

  res.status(200);
  res.json({
    name: dbTournament.name,
    date: moment(dbTournament.date),
    type: dbTournament.type
  });
};
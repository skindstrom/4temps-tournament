// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import { getTournament } from '../../data/tournament';
import type { UserModel } from '../../data/user';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  const user: ?UserModel = req.session.user;
  if (user == null) {
    res.sendStatus(401);
    return;
  }

  const dbTournament = await getTournament(req.params.tournamentId);

  if (dbTournament == null) {
    res.sendStatus(404);
    return;
  }

  if (dbTournament.userId.toString() !== user._id) {
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
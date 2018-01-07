// @flow
import type { $Request, $Response } from 'express';

import { getTournamentsForUser } from '../../data/tournament';
import type { TournamentModel } from '../../data/tournament';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  const userId = req.session.user._id;

  const tournaments: Array<TournamentModel> =
    await getTournamentsForUser(userId);
  res.status(200);
  res.json(tournaments);
};

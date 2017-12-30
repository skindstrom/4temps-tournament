// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';

import { getTournamentsForUser } from '../../data/tournament';
import type { Tournament } from '../../models/tournament';

export default async (req: $Request, res: $Response) => {
  const tournaments: Array<Tournament> =
    // $FlowFixMe
    (await getTournamentsForUser(req.session.user._id))
      .map(db => ({ name: db.name, date: moment(db.date), type: db.type }));
  res.status(200);
  res.json(tournaments);
};

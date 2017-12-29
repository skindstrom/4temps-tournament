// @flow

import type { $Request, $Response } from 'express';
import moment from 'moment';

import { getTournaments } from '../../data/tournament';
import type { Tournament } from '../../models/tournament';

export default async (req: $Request, res: $Response) => {
  const tournaments: Array<Tournament> =
    // $FlowFixMe
    (await getTournaments())
      .map(db => ({ name: db.name, date: moment(db.date), type: db.type }));
  res.status(200);
  res.json(tournaments);
};
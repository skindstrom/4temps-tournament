// @flow

import type { $Request, $Response } from 'express';

import { getTournaments } from '../../data/tournament';

export default async (req: $Request, res: $Response) => {
  const tournaments = await getTournaments();
  res.status(200);
  res.json(tournaments);
};
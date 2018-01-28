// @flow

import { getTournaments } from '../../data/tournament';

export default async (req: ServerApiRequest, res: ServerApiResponse) => {
  const tournaments = await getTournaments();
  res.status(200);
  res.json(tournaments);
};

// @flow
import { getTournamentsForUser } from '../../data/tournament';

export default async (req: ServerApiRequest, res: ServerApiResponse) => {
  // $FlowFixMe
  const userId = req.session.user._id;

  const tournaments: Array<Tournament> =
    await getTournamentsForUser(userId);
  res.status(200);
  res.json(tournaments);
};

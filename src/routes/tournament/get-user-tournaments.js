// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class GetUserTournamentsRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    // $FlowFixMe
    const userId = req.session.user._id;

    const tournaments: Array<Tournament> =
      await this._repository.getForUser(userId);
    res.json(tournaments);
  }
}

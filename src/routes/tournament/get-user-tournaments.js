// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class GetAdminTournamentsRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const userId = req.session.user.id;
    const tournaments: Array<Tournament> =
      await this._repository.getForUser(userId);
    res.json(tournaments);
  }
}

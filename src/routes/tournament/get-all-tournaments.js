// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class GetAllTournamentsRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    res.json(await this._repository.getAll());
  };
}

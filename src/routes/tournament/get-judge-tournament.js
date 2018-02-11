// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class GetJudgeTournamentRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (req.session.user != null && req.session.user.role === 'judge') {
      const judgeId = req.session.user.id;
      const tournament = await this._repository.getForJudge(judgeId);
      res.json(tournament);
    } else {
      res.sendStatus(401);
    }
  };
}

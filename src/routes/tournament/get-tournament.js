// @flow
import type { RouteResult } from '../util';
import type { TournamentRepository } from '../../data/tournament';

export default class GetTournamentRoute {
  _tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }

    const userId: string = req.session.user.id;
    const tournamentId = req.params.tournamentId;

    const { status, body } = await getTournamentRoute(
      tournamentId,
      userId,
      this._tournamentRepository
    );

    res.status(status);
    res.json(body);
  };
}

export async function getTournamentRoute(
  tournamentId: string,
  userId: string,
  tournamentRepository: TournamentRepository
): RouteResult<?Tournament> {
  const tournament = await tournamentRepository.get(tournamentId);

  if (tournament == null) {
    return { status: 404, body: null };
  } else if (tournament.creatorId != userId) {
    return { status: 401, body: null };
  }

  return {
    status: 200,
    body: tournament
  };
}

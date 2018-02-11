// @flow
import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import type { TournamentRepository } from '../../data/tournament';
import type { RouteResult } from '../util';
import parseTournament from './parse-tournament';

export default class UpdateTournamentRoute {
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

    // $FlowFixMe
    const requestBody: any = req.body;
    const tournament = parseTournament(requestBody.tournament);

    const { status, body } = await updateTournamentRoute(
      userId,
      tournament,
      this._repository
    );

    res.status(status);
    res.json(body);
  };
}

export async function updateTournamentRoute(
  userId: string,
  tournament: Tournament,
  repository: TournamentRepository
): RouteResult<?Tournament> {
  const { isValidTournament } = validateTournament(tournament);
  let status: number = 200;
  if (isValidTournament) {
    const dbTournament = await repository.get(tournament.id);

    if (dbTournament == null) {
      status = 404;
    } else if (dbTournament.creatorId != userId) {
      status = 401;
    } else {
      const newTournament = {
        ...tournament,
        creatorId: dbTournament.creatorId
      };
      try {
        await repository.update(newTournament);
      } catch (e) {
        status = 500;
      }
    }
  } else {
    status = 400;
  }

  const body = status === 200 ? tournament : null;

  return { status, body };
}

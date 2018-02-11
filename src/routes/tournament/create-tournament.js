// @flow
import validateTournament from '../../validators/validate-tournament';
import type { TournamentRepository } from '../../data/tournament';
import type { RouteResult } from '../util';
import parseTournament from './parse-tournament';

class CreateTournamentRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }

    const userId: string = req.session.user.id;

    // $FlowFixMe
    const requestBody: any = req.body;
    const tournament = {
      ...parseTournament(requestBody),
      creatorId: userId
    };

    const { status, body } = await createTournamentRoute(
      userId,
      tournament,
      this._repository
    );

    res.status(status);
    res.json(body);
  };
}

export async function createTournamentRoute(
  userId: string,
  tournament: Tournament,
  repository: TournamentRepository
): RouteResult<?Tournament> {
  const { isValidTournament } = validateTournament(tournament);
  let status: number = 200;

  if (isValidTournament) {
    try {
      await repository.create(tournament);
    } catch (e) {
      status = 500;
    }
  } else {
    status = 400;
  }

  const body = status === 200 ? tournament : null;

  return { status, body };
}

export default CreateTournamentRoute;

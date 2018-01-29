// @flow
import moment from 'moment';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import type { TournamentRepository } from '../../data/tournament';
import type { RouteResult } from '../util';

class CreateTournamentRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    // $FlowFixMe
    const requestBody: any = req.body;
    const tournament: Tournament = {
      _id: requestBody._id || '',
      name: requestBody.name || '',
      date: moment(requestBody.date) || moment(0),
      type: requestBody.type || 'none',
      judges: requestBody.judges || [],
      // $FlowFixMe
      creatorId: req.session.user._id
    };

    // $FlowFixMe
    const userId: string = req.session.user._id;

    const { status, body } =
      await createTournamentRoute(
        userId, tournament, this._repository);

    res.status(status);
    res.json(body);

  }
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

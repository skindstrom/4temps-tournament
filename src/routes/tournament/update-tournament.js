// @flow
import moment from 'moment';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import { getTournament, updateTournament } from '../../data/tournament';
import type { RouteResult } from '../util';

export const updateTournamentRoute = async (
  userId: string,
  tournamentId: string,
  tournament: Tournament,
  getTournament: (tournamentId: string) => Promise<?Tournament>,
  updateTournament: (tournamentId: string, tournament: Tournament)
    => Promise<?Tournament>): RouteResult<?Tournament> => {

  const { isValidTournament } = validateTournament(tournament);
  let status: number = 200;
  if (isValidTournament) {
    const dbTournament = await getTournament(tournamentId);


    if (dbTournament == null) {
      status = 404;
    }
    else if (dbTournament.creatorId != userId) {
      status = 401;
    } else {
      const newTournament = {
        ...tournament,
        creatorId: dbTournament.creatorId
      };
      if (await updateTournament(tournamentId, newTournament) == null) {
        status = 500;
      }
    }
  } else {
    status = 400;
  }

  const body = status === 200 ? tournament : null;

  return { status, body };
};

export default async (req: ServerApiRequest, res: ServerApiResponse) => {
  // $FlowFixMe
  const requestBody: any = req.body;

  const tournament: Tournament = {
    _id: requestBody.tournament._id || '',
    name: requestBody.tournament.name || '',
    date: moment(requestBody.tournament.date) || moment(0),
    type: requestBody.tournament.type || 'none',
    judges: requestBody.judges || [],
    creatorId: requestBody.creatorId
  };

  // $FlowFixMe
  const userId: string = req.session.user._id;
  const tournamentId: string = requestBody.tournamentId || '';

  const { status, body } =
    await updateTournamentRoute(userId, tournamentId, tournament,
      getTournament, updateTournament);

  res.status(status);
  res.json(body);
};

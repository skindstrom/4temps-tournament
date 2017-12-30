// @flow

import moment from 'moment';

import {
  apiGetRequest,
  apiAuthGetRequest,
  apiAuthPostRequest,
} from '../util';
import type { ApiRequest, AuthorizedApiRequest } from '../util';

import validateTournament from '../../../validators/validate-tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';

type CreateTournamentResponse = {
  validation: TournamentValidationSummary,
  tournamentId: ?string,
}

export const createTournament =
  async (
    tournament: Tournament): AuthorizedApiRequest<CreateTournamentResponse> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      return {
        wasAuthenticated: true,
        result: { validation, tournamentId: null }
      };
    }

    return apiAuthPostRequest('/api/tournament/create', tournament);
  };

const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export const getTournamentsForUser =
  async (): AuthorizedApiRequest<Array<Tournament>> => {
    const response: AuthorizedApiRequest<Array<Tournament>> =
      apiAuthGetRequest('/api/tournament/get');
    const { wasAuthenticated, result } = await response;

    if (result != null) {
      return { wasAuthenticated, result: result.map(deserializeTournament) };
    }
    return { wasAuthenticated, result: null };
  };

export const getAllTournaments = async (): ApiRequest<Array<Tournament>> => {
  const response: ApiRequest<Array<Tournament>> =
    apiGetRequest('/api/tournament/get-all');
  const { result } = await response;

  if (result != null) {
    return { result: result.map(deserializeTournament) };
  }
  return { result: null };
};

export const getTournament =
  async (tournamentId: string): AuthorizedApiRequest<Tournament> => {
    const response: AuthorizedApiRequest<Tournament> =
      apiAuthGetRequest(`/api/tournament/get/${tournamentId}`);
    const { wasAuthenticated, result } = await response;

    if (result != null) {
      return { wasAuthenticated, result: deserializeTournament(result) };
    }
    return { wasAuthenticated, result: null };
  };
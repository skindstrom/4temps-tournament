// @flow

import moment from 'moment';

import {
  apiGetRequest,
  apiPostRequest,
} from '../util';
import type { ApiRequest } from '../util';

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
    tournament: Tournament): ApiRequest<CreateTournamentResponse> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      return {
        wasAuthenticated: true,
        result: { validation, tournamentId: null }
      };
    }

    return apiPostRequest('/api/tournament/create', tournament);
  };

const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export const getTournamentsForUser =
  async (): ApiRequest<Array<Tournament>> => {
    const response: ApiRequest<Array<Tournament>> =
      apiGetRequest('/api/tournament/get');
    const { result } = await response;

    if (result != null) {
      return { result: result.map(deserializeTournament) };
    }
    return { result: null };
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
  async (tournamentId: string): ApiRequest<Tournament> => {
    const response: ApiRequest<Tournament> =
      apiGetRequest(`/api/tournament/get/${tournamentId}`);
    const { result } = await response;

    if (result != null) {
      return { result: deserializeTournament(result) };
    }
    return { result: null };
  };
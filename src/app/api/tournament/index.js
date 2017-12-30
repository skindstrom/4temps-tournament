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
        validation, tournamentId: null
      };
    }

    return apiPostRequest('/api/tournament/create', tournament);
  };

const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export const getTournamentsForUser =
  (): ApiRequest<Array<Tournament>> => {
    return apiGetRequest('/api/tournament/get',
      (tours) => (tours.map(deserializeTournament)));
  };

export const getAllTournaments = (): ApiRequest<Array<Tournament>> => {
  return apiGetRequest('/api/tournament/get-all',
    (tours) => (tours.map(deserializeTournament)));
};

export const getTournament =
  async (tournamentId: string): ApiRequest<Tournament> => {
    return apiGetRequest(`/api/tournament/get/${tournamentId}`,
      deserializeTournament);
  };
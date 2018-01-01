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
import type { CreateTournamentResponse } from
  '../../../routes/tournament/create-tournament';

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

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): ApiRequest<{
      validation: TournamentValidationSummary,
      tournament: ?Tournament
    }> => {

    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      return {
        validation, tournament: null
      };
    }

    return apiPostRequest('/api/tournament/update',
      { tournamentId, tournament },
      result => {
        const { tournament, ...rest } = result;

        if (tournament != null) {
          return { ...rest, tournament: deserializeTournament(tournament) };
        }

        return result;
      });
  };
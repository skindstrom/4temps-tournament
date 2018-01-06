// @flow

import moment from 'moment';

import {
  apiGetRequest,
  apiPostRequest,
} from '../util';

import validateTournament from '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';
import type { CreateTournamentResponse } from
  '../../../routes/tournament/create-tournament';
import type { UpdateTournamentResponse } from
  '../../../routes/tournament/update-tournament';

export const createTournament =
  async (
    tournament: Tournament): ApiRequest<CreateTournamentResponse> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      return {
        success: false,
        result: {
          validation, tournamentId: null
        }
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
  return apiGetRequest('/api/tournament/get/all',
    (tours) => (tours.map(deserializeTournament)));
};

export const getTournament =
  async (tournamentId: string): ApiRequest<Tournament> => {
    return apiGetRequest(`/api/tournament/get/${tournamentId}`,
      deserializeTournament);
  };

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): ApiRequest<UpdateTournamentResponse> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      return {
        success: false,
        result: {
          validation, tournament: null
        }
      };
    }

    return apiPostRequest('/api/tournament/update',
      { tournamentId, tournament },
      (result: UpdateTournamentResponse) => {
        const { tournament, ...rest } = result;

        if (tournament != null) {
          return { ...rest, tournament: deserializeTournament(tournament) };
        }

        return result;
      });
  };
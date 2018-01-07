// @flow

import moment from 'moment';

import {
  apiGetRequest,
  apiPostRequest,
} from '../util';

import validateTournament from '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';
import type { UpdateTournamentResponse } from
  '../../../routes/tournament/update-tournament';

export const createTournament =
  async (
    tournament: Tournament): Promise<Tournament> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      throw validation;
    }

    return apiPostRequest('/api/tournament/create', tournament,
      deserializeTournament);
  };

const deserializeTournament = (tour: Tournament): Tournament => {
  const { date, ...rest } = tour;
  return { date: moment(date), ...rest };
};

export const getTournamentsForUser =
  (): Promise<Array<Tournament>> => {
    return apiGetRequest('/api/tournament/get',
      (tours) => (tours.map(deserializeTournament)));
  };

export const getAllTournaments = (): Promise<Array<Tournament>> => {
  return apiGetRequest('/api/tournament/get/all',
    (tours) => (tours.map(deserializeTournament)));
};

export const getTournament =
  async (tournamentId: string): Promise<Tournament> => {
    return apiGetRequest(`/api/tournament/get/${tournamentId}`,
      deserializeTournament);
  };

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): Promise<UpdateTournamentResponse> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      throw validation;
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
// @flow

import moment from 'moment';

import {
  apiGetRequest,
  apiPostRequest,
} from '../util';

import validateTournament from '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';
import {
  normalizeTournamentArray,
  normalizeTournament
} from '../../reducers/normalize';

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
  (): Promise<Array<mixed>> => {
    return apiGetRequest('/api/tournament/get',
      (tours) => normalizeTournamentArray(tours.map(deserializeTournament)));
  };

export const getTournamentForJudge = (): Promise<mixed> => {
  return apiGetRequest('/api/tournament/get/judge', normalizeTournament);
};

export const getAllTournaments = (): Promise<mixed> => {
  return apiGetRequest('/api/tournament/get/all',
    (tours) => normalizeTournamentArray(tours.map(deserializeTournament)));
};

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): Promise<Tournament> => {
    let validation = validateTournament(tournament);
    if (!validation.isValidTournament) {
      throw validation;
    }

    return apiPostRequest(`/api/tournament/update/${tournamentId}`,
      { tournamentId, tournament }, deserializeTournament);
  };

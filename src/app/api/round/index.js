// @flow

import { apiPostRequest, apiGetRequest, apiDeleteRequest } from '../util';

import validateRound from '../../../validators/validate-round';

export async function createRound(
  tournamentId: string, round: Round): Promise<Round> {
  const validation = validateRound(round);
  if (!validation.isValidRound) {
    throw validation;
  }

  return apiPostRequest('/api/round/create', { tournamentId, round });
}

export async function getRounds(tournamentId: string): Promise<{
  tournamentId: string,
  rounds: Array<Round>
}> {
  return apiGetRequest(`/api/round/get?tournamentId=${tournamentId}`);
}

export async function updateRounds(
  tournamentId: string, rounds: Array<Round>): Promise<{
    tournamentId: string,
    rounds: Array<Round>
  }> {
  return apiPostRequest('/api/round/update', {tournamentId, rounds});
}

export async function deleteRound(roundId: string): Promise<{
  tournamentId: string,
  roundId: string}> {
  return apiDeleteRequest(`/api/round/delete/${roundId}`);
}

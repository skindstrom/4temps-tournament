// @flow

import { apiPostRequest, apiDeleteRequest } from '../util';

import validateRound from '../../../validators/validate-round';

export async function createRound(
  tournamentId: string, round: Round): Promise<Round> {
  const validation = validateRound(round);
  if (!validation.isValidRound) {
    throw validation;
  }

  return apiPostRequest('/api/round/create', { tournamentId, round });
}

export async function deleteRound(
  tournamentId: string, roundId: string): Promise<{
    tournamentId: string,
    roundId: string}> {
  return apiDeleteRequest(
    `/api/round/delete/${tournamentId}/${roundId}`);
}

// @flow

import { apiPostRequest, apiGetRequest } from '../util';

import validateRound from '../../../validators/validate-round';
import type { RoundDbModel } from '../../../data/round';

export async function createRound(
  tournamentId: string, round: Round): Promise<RoundDbModel> {
  const validation = validateRound(round);
  if (!validation.isValidRound) {
    throw validation;
  }

  return apiPostRequest('/api/round/create', { tournamentId, round });
}

export async function getRounds(tournamentId: string): Promise<{
  tournamentId: string,
  rounds: Array<RoundDbModel>
}> {
  return apiGetRequest(`/api/round/get?tournamentId=${tournamentId}`);
}
// @flow

import { apiPostRequest, apiDeleteRequest } from '../util';

import validateRound from '../../../validators/validate-round';

export async function createRound(
  tournamentId: string,
  round: Round
): Promise<Round> {
  const validation = validateRound(round);
  if (!validation.isValidRound) {
    throw validation;
  }

  return apiPostRequest(`/api/round/${tournamentId}/create`, {
    tournamentId,
    round
  });
}

export async function deleteRound(
  tournamentId: string,
  roundId: string
): Promise<{
  tournamentId: string,
  roundId: string
}> {
  return apiDeleteRequest(`/api/round/${tournamentId}/delete/${roundId}`);
}

export async function startRound(
  tournamentId: string,
  roundId: string
): Promise<mixed> {
  return apiPostRequest(`/api/round/${tournamentId}/start/${roundId}`);
}

export async function generateGroupsForRound(
  tournamentId: string,
  roundId: string
): Promise<mixed> {
  return apiPostRequest(
    `/api/round/${tournamentId}/generate-groups/${roundId}`
  );
}

export async function startNextDance(tournamentId: string): Promise<mixed> {
  return apiPostRequest(`/api/round/${tournamentId}/start-dance`);
}

export async function endDance(tournamentId: string): Promise<mixed> {
  return apiPostRequest(`/api/round/${tournamentId}/end-dance`);
}

export async function regenerateGroup(
  tournamentId: string,
  roundId: string,
  groupId: string
): Promise<mixed> {
  return apiPostRequest(
    `/api/round/${tournamentId}/regenerate/${roundId}/group/${groupId}`
  );
}

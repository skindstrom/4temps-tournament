// @flow

import { apiPostRequest } from '../util';

import type { Participant } from '../../../models/participant';
import { validateParticipant } from '../../../validators/validate-participant';

export const createParticipant = async (
  tournamentId: string,
  participant: Participant
): Promise<{
  tournamentId: string,
  participant: Participant
}> => {
  const validation = validateParticipant(participant);
  if (!validation.isValidParticipant) {
    throw validation;
  }

  return apiPostRequest(`/api/participant/${tournamentId}/create`, {
    tournamentId,
    participant
  });
};

export async function changeAttendance(
  tournamentId: string,
  participantId: string,
  isAttending: boolean
) {
  return apiPostRequest(`/api/participant/${tournamentId}/attendance`, {
    participantId,
    isAttending
  });
}

export default createParticipant;

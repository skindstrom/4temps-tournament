// @flow

import { apiPostRequest, apiGetRequest } from '../util';

import type { Participant } from '../../../models/participant';
import { validateParticipant } from '../../../validators/validate-participant';
import type { ParticipantValidationSummary } from
  '../../../validators/validate-participant';

export const createParticipant =
  async (tournamentId: string,
    participant: Participant): Promise<ParticipantValidationSummary> => {
    const validation = validateParticipant(participant);
    if (!validation.isValidParticipant) {
      throw validation;
    }

    return apiPostRequest('/api/participant/create',
      { tournamentId, participant });
  };

export const getParticipants =
  async (tournamentId: string): Promise<Array<Participant>> => {
    return apiGetRequest(`/api/participant/get/tournament/${tournamentId}`);
  };
// @flow

import { apiPostRequest } from '../util';
import type { ApiRequest } from '../util';

import type { Participant } from '../../../models/participant';
import { validateParticipant } from '../../../validators/validate-participant';
import type { ParticipantValidationSummary } from
  '../../../validators/validate-participant';

export const createParticipant =
  async (tournamentId: string,
    participant: Participant): ApiRequest<ParticipantValidationSummary> => {
    const validation = validateParticipant(participant);
    if (!validation.isValidParticipant) {
      return { success: false, result: validation };
    }

    return apiPostRequest('/api/participant/create',
      { tournamentId, participant });
  };

export default createParticipant;
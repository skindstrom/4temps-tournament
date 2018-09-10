// @flow

import { apiPostRequest } from '../util';
import validateAssistant from '../../../validators/validate-assistant';

export async function createAssistant(
  tournamentId: string,
  assistant: Assistant
) {
  if (!validateAssistant(assistant)) {
    throw false;
  }
  return apiPostRequest(`/api/assistant/${tournamentId}/create`, assistant);
}

export default createAssistant;

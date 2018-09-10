// @flow

import { apiPostRequest } from '../util';
import validateJudge from '../../../validators/validate-judge';
import isValidAccessKey from '../../../validators/validate-access-key';

export async function createJudge(tournamentId: string, judge: Judge) {
  if (!validateJudge(judge)) {
    throw false;
  }
  return apiPostRequest(`/api/judge/${tournamentId}/create`, judge);
}

export async function loginJudge(accessKey: string) {
  if (!isValidAccessKey(accessKey)) {
    throw { isValidAccessKey: false, doesAccessKeyExist: true };
  }
  return apiPostRequest('/api/judge/login', { accessKey });
}

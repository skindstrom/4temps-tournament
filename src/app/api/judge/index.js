// @flow

import { apiPostRequest } from '../util';
import validateJudge from '../../../validators/validate-judge';
import validateJudgeLogin from '../../../validators/validate-judge-login';

export async function createJudge(tournamentId: string, judge: Judge) {
  if (!validateJudge(judge)) {
    throw false;
  }
  return apiPostRequest(`/api/judge/${tournamentId}/create`, judge);
}

export async function loginJudge(accessKey: string) {
  let isValid = await validateJudgeLogin(accessKey);
  if (!isValid) {
    throw { isValidAccessKey: false, doesAccessKeyExist: true };
  }
  return apiPostRequest('/api/judge/login', { accessKey });
}

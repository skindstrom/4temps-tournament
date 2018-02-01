// @flow

import {apiPostRequest} from '../util';
import validateJudge from '../../../validators/validate-judge';

export default async function createJudge(
  tournamentId: string, judge: Judge) {

  if (!validateJudge(judge)) {
    throw false;
  }

  return apiPostRequest(`/api/judge/${tournamentId}/create`, judge);
}

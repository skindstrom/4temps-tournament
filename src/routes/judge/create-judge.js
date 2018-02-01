// @flow

import type {TournamentRepository} from '../../data/tournament';

export default function route(repository: TournamentRepository) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const judgeId = parseJudgeId(req.body);
      await repository.addJudge(req.params.tournamentId, judgeId);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(statusFromError(e));
    }
  };
}

function parseJudgeId(body: mixed): string {
  if (typeof body === 'object' && body != null
    && typeof body.judgeId === 'string') {
    return body.judgeId;
  }
  throw new InvalidJudgeId;
}

function statusFromError(e: mixed) {
  if (e instanceof InvalidJudgeId) {
    return 400;
  }
  return 500;
}

function InvalidJudgeId(){}

// @flow

import type { TournamentRepository } from '../../data/tournament';
import type { AccessKeyRepository } from '../../data/access-key';
import validateJudgeLogin from '../../validators/validate-judge-login';

export default function route(
  tournamentRepository: TournamentRepository,
  accessRepository: AccessKeyRepository
) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const accessKey = parseAccessKey(req.body);

      if (validateJudgeLogin(accessKey)) {
        const dbModel = await accessRepository.getForKey(accessKey);
        if (dbModel) {
          const tournament = await tournamentRepository.get(
            dbModel.tournamentId
          );
          if (tournament == null) {
            res.status(404);
            return;
          }
          const judge = getJudge(dbModel.userId, tournament);
          req.session.user = { id: judge.id, role: 'judge' };
          res.json({ userId: judge.id });
        } else {
          res.status(404);
          res.json({ isValidAccessKey: true, doesAccessKeyExist: false });
        }
      } else {
        res.status(400);
        res.json({ isValidAccessKey: false, doesAccessKeyExist: true });
      }
    } catch (e) {
      res.status(statusFromError(e));
      res.json({ isValidAccessKey: true, doesAccessKeyExist: false });
    }
  };
}

function parseAccessKey(body: mixed): string {
  if (
    body != null &&
    typeof body === 'object' &&
    typeof body.accessKey === 'string' &&
    body.accessKey != null
  ) {
    return body.accessKey;
  }
  throw new ParseError();
}

function statusFromError(e: mixed) {
  if (e instanceof ParseError) {
    return 400;
  }
  return 500;
}

function getJudge(userId: string, tournament: Tournament): Judge {
  const results = tournament.judges.filter(judge => {
    return judge.id === userId;
  });

  if (results.length !== 1) {
    throw new Error('Could not find judge!');
  }
  return results[0];
}

function ParseError() {}

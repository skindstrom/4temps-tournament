// @flow

import ObjectId from 'bson-objectid';
import type {TournamentRepository} from '../../data/tournament';
import type {AccessKeyRepository} from '../../data/access-key';
import validateJudge from '../../validators/validate-judge';

export default function route(
  tournamentRepository: TournamentRepository,
  accessRepository: AccessKeyRepository) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const judgeName = parseName(req.body);
      const judge = {name: judgeName, _id: ObjectId.generate()};

      if (validateJudge(judge)) {
        await tournamentRepository.addJudge(tournamentId, judge);
        await accessRepository.createForTournamentAndUser(
          tournamentId, judge._id);
        res.json({tournamentId, judge});
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      res.sendStatus(statusFromError(e));
    }
  };
}

function parseName(body: mixed): string {
  if (typeof body === 'object'
    && body != null
    && typeof body.name === 'string') {
    return body.name;
  }
  throw new ParseError;
}

function statusFromError(e: mixed) {
  if (e instanceof ParseError) {
    return 400;
  }
  return 500;
}

function ParseError(){}

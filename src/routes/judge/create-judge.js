// @flow

import ObjectId from 'bson-objectid';
import type { TournamentRepository } from '../../data/tournament';
import type { AccessKeyRepository } from '../../data/access-key';
import validateJudge from '../../validators/validate-judge';
import { createMalusCriterion } from '../util';

export default function route(
  tournamentRepository: TournamentRepository,
  accessRepository: AccessKeyRepository
) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const { name, judgeType } = parseJudge(req.body);
      const judge = { name, judgeType, id: ObjectId.generate() };

      // $FlowFixMe
      if (validateJudge(judge)) {
        if (
          hasPresidentJudge(await tournamentRepository.get(tournamentId)) &&
          judgeType === 'president'
        ) {
          throw new HasPresidentError();
        }

        await tournamentRepository.addJudge(tournamentId, judge);
        await accessRepository.createForTournamentAndUserWithRole(
          tournamentId,
          judge.id,
          'judge'
        );

        if (judge.judgeType === 'sanctioner') {
          await addMalusCriterionToRoundsIfNotExists(
            tournamentId,
            tournamentRepository
          );
        }

        res.json({ tournamentId, judge });
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      res.sendStatus(statusFromError(e));
    }
  };
}

function parseJudge(body: mixed): { name: string, judgeType: string } {
  if (
    typeof body === 'object' &&
    body != null &&
    typeof body.name === 'string' &&
    typeof body.judgeType === 'string'
  ) {
    return { name: body.name, judgeType: body.judgeType };
  }
  throw new ParseError();
}

function statusFromError(e: mixed) {
  if (e instanceof ParseError) {
    return 400;
  } else if (e instanceof HasPresidentError) {
    return 409;
  }
  return 500;
}

async function addMalusCriterionToRoundsIfNotExists(
  tournamentId: string,
  tournamentRepository: TournamentRepository
) {
  const tournament = await tournamentRepository.get(tournamentId);
  if (!tournament) {
    throw 'Tournament not found';
  }

  for (const round of tournament.rounds) {
    if (!hasMalusCriterion(round)) {
      round.criteria.push(createMalusCriterion());
      await tournamentRepository.updateRound(tournamentId, round);
    }
  }
}

function hasMalusCriterion(round: Round): boolean {
  return round.criteria.some(
    ({ forJudgeType }) => forJudgeType === 'sanctioner'
  );
}

function hasPresidentJudge(tournament: ?Tournament): boolean {
  return (
    tournament != null &&
    tournament.judges.some(judge => judge.judgeType === 'president')
  );
}

function ParseError() {}
function HasPresidentError() {}

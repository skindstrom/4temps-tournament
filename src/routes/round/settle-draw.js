// @flow
import type { TournamentRepository } from '../../data/tournament';

export default class SettleDrawRoute {
  _tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const tournamentId: string = req.params.tournamentId;

    const tournament: ?Tournament = await this._tournamentRepository.get(
      tournamentId
    );

    if (!tournament) {
      res.status(404);
      res.json({ error: 'no such tournament' });
    } else {
      if (
        !isPresidentJudge(
          (req.session.user && req.session.user.id) || '',
          tournament.judges
        )
      ) {
        res.status(403);
        res.json({ error: 'must be president judge' });
      } else {
        const activeRound: ?Round = findActiveRound(tournament.rounds);
        const roundScores: Array<Score> = parseRoundScores(req.body);
        if (!activeRound) {
          res.status(404);
          res.json({ error: 'no round is active' });
        } else if (!activeRound.draw) {
          res.status(404);
          res.json({ error: 'no round is draw' });
        } else if (!scoreIncludesAllParticipants(activeRound, roundScores)) {
          res.status(400);
          res.json({ error: 'score does not include all participants' });
        } else if (
          !scoreIncludesOnlyParticipantsOfRound(activeRound, roundScores)
        ) {
          res.status(400);
          res.json({
            error: 'score includes participant(s) not in this round'
          });
        } else {
          res.status(200);
          const updatedRound: Round = {
            ...activeRound,
            active: false,
            finished: true,
            draw: false,
            roundScores
          };
          try {
            await this._tournamentRepository.updateRound(
              tournamentId,
              updatedRound
            );
            res.json(updatedRound);
          } catch (e) {
            res.sendStatus(500);
            // eslint-disable-next-line
            console.error(e);
          }
        }
      }
    }
  };
}

function parseRoundScores(body: mixed): Array<Score> {
  if (Array.isArray(body)) {
    return body
      .map((obj: mixed) => {
        if (
          typeof obj === 'object' &&
          obj != null &&
          typeof obj.participantId === 'string' &&
          typeof obj.score === 'number'
        ) {
          return { participantId: obj.participantId, score: obj.score };
        }
        return null;
      })
      .filter(Boolean);
  }

  return [];
}

function findActiveRound(rounds: Array<Round>): ?Round {
  return rounds.find(round => round.active);
}

function isPresidentJudge(judgeId: string, judges: Array<Judge>): boolean {
  return (
    judges.find(
      judge => judge.judgeType === 'president' && judge.id === judgeId
    ) != null
  );
}

function scoreIncludesAllParticipants(
  round: Round,
  scores: Array<Score>
): boolean {
  const participants = participantsInRound(round);
  const scoreOfParticipantInTournamentCount = scores
    .map(score => participants.includes(score.participantId))
    .filter(Boolean).length;

  return participants.length === scoreOfParticipantInTournamentCount;
}

function scoreIncludesOnlyParticipantsOfRound(
  round: Round,
  scores: Array<Score>
): boolean {
  const participants = participantsInRound(round);
  return scores
    .map(score => participants.includes(score.participantId))
    .every(Boolean);
}

function participantsInRound(round: Round): Array<string> {
  return pairsInRound(round)
    .reduce(
      (participants: Array<?string>, pair) => [
        ...participants,
        pair.leader,
        pair.follower
      ],
      []
    )
    .filter(Boolean);
}

function pairsInRound(round: Round): Array<Pair> {
  return round.groups.reduce(
    (pairs: Array<Pair>, group: DanceGroup) => [...pairs, ...group.pairs],
    []
  );
}

// @flow

import { Router } from 'express';
import { allow } from '../auth-middleware';
import { TournamentRepositoryImpl } from '../../data/tournament';

const router = Router();

router.get('/:tournamentId', allow('public'), getLeaderboard);

const tournamentRepository = new TournamentRepositoryImpl();
async function getLeaderboard(req: ServerApiRequest, res: ServerApiResponse) {
  const tournament = await tournamentRepository.get(req.params.tournamentId);
  if (tournament == null) {
    res.sendStatus(404);
    return;
  }

  res.json(createLeaderboard(tournament));
}

function createLeaderboard(tournament: Tournament): Leaderboard {
  const participantMap = tournament.participants.reduce((acc, participant) => {
    acc[participant.id] = participant;
    return acc;
  }, {});
  return {
    tournamentId: tournament.id,
    rounds: tournament.rounds.map(round =>
      createLeaderboardRound(round, participantMap)
    )
  };
}

function createLeaderboardRound(
  round: Round,
  participants: { [id: string]: Participant }
): LeaderboardRound {
  if (!round.finished) {
    return {
      roundId: round.id,
      name: round.name,
      isFinished: false,
      winningLeaderScores: [],
      winningFollowerScores: [],
      losingLeaderScores: [],
      losingFollowerScores: []
    };
  }

  const scores = hydrateScores(round.scores, participants);

  const pairs = getPairs(round);

  const leaders = new Set(getLeaders(pairs));
  const followers = new Set(getFollowers(pairs));

  const leaderScores = scores
    .filter(({ id }) => leaders.has(id))
    .map((score, i) => ({ ...score, position: i + 1 }));

  const followerScores = scores
    .filter(({ id }) => followers.has(id))
    .map((score, i) => ({ ...score, position: i + 1 }));

  return {
    roundId: round.id,
    name: round.name,
    isFinished: round.finished,
    winningLeaderScores: leaderScores.slice(0, round.passingCouplesCount),
    winningFollowerScores: followerScores.slice(0, round.passingCouplesCount),
    losingLeaderScores: leaderScores.slice(round.passingCouplesCount),
    losingFollowerScores: followerScores.slice(round.passingCouplesCount)
  };
}

function hydrateScores(
  scores: Array<Score>,
  participants: { [id: string]: Participant }
) {
  let prevScore: ?number;
  let prevPosition: number = 1;
  return scores.map((score, i) => {
    const participant = participants[score.participantId];
    let position = i + 1;

    if (score.score == prevScore) {
      position = prevPosition;
    }

    prevPosition = position;
    prevScore = score.score;

    return {
      id: participant.id,
      attendanceId: participant.attendanceId,
      position,
      score: score.score
    };
  });
}

function getPairs(round: Round): Array<Pair> {
  return round.groups.reduce((pairs, group) => [...pairs, ...group.pairs], []);
}

function getLeaders(pairs: Array<Pair>): Array<string> {
  return pairs.reduce(
    (acc, pair) => (pair.leader != null ? [...acc, pair.leader] : acc),
    []
  );
}

function getFollowers(pairs: Array<Pair>): Array<string> {
  return pairs.reduce(
    (acc, pair) => (pair.follower != null ? [...acc, pair.follower] : acc),
    []
  );
}

export default router;

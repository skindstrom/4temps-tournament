// @flow

import { Router } from 'express';
import { allow } from '../auth-middleware';
import { TournamentRepositoryImpl } from '../../data/tournament';

const router = Router();

router.get('/:tournamentId', allow('public'), getLeaderboard);

const tournamentRepository = new TournamentRepositoryImpl();
async function getLeaderboard(req: ServerApiRequest, res: ServerApiResponse) {
  try {
    const tournament = await tournamentRepository.get(req.params.tournamentId);
    if (tournament == null) {
      res.status(404);
      res.json({ didFindTournament: false });
    } else {
      res.json(createLeaderboard(tournament));
    }
  } catch (e) {
    res.status(500);
    res.json({ serverError: true });
  }
}

function createLeaderboard(tournament: Tournament): Leaderboard {
  const participantMap = tournament.participants.reduce((acc, participant) => {
    acc[participant.id] = participant;
    return acc;
  }, {});
  const rounds = tournament.rounds.map(round =>
    createLeaderboardRound(round, participantMap)
  );
  return {
    tournamentId: tournament.id,
    rounds,
    remainingParticipants: getRemainingParticipants(rounds, participantMap),
    tournamentName: tournament.name
  };
}

function getRemainingParticipants(
  rounds: Array<LeaderboardRound>,
  participants: { [id: string]: Participant }
): Array<Participant> {
  return Object.keys(participants).map(id => {
    return participants[id];
  }).filter(p => p.isAttending)
    .filter(p => !hasLost(p, rounds)).map(p => {
      return {
        id: p.id,
        name: '',
        isAttending: true,
        attendanceId: p.attendanceId,
        role: p.role
      };
    });
}

function hasLost(
  participant: Participant,
  rounds: Array<LeaderboardRound>
) {
  const losingFollowers = rounds.reduce((ack, r) =>
    [...ack, ...r.losingFollowerScores], []
  );
  const losingLeaders = rounds.reduce((ack, r) =>
    [...ack, ...r.losingLeaderScores], []
  );
  return losingFollowers.find(s => s.id === participant.id) ||
    losingLeaders.find(s => s.id === participant.id);
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

  const leaderScores = scores.filter(({ id }) => leaders.has(id));

  const followerScores = scores.filter(({ id }) => followers.has(id));

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

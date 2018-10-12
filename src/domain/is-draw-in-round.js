// @flow

export default function isDrawInRound(round: Round) {
  const { passingCouplesCount, roundScores } = round;
  const pairs = getPairs(round);

  return ['leader', 'follower']
    .map(role => getParticipantsFromPairsForRole(role, pairs))
    .map(participants => scoresForParticipants(participants, roundScores))
    .map(scores => isScoreDraw(passingCouplesCount, scores))
    .includes(true);
}

function getPairs(round: Round): Array<Pair> {
  return round.groups.reduce(
    (pairs: Array<Pair>, group: DanceGroup) => [...pairs, ...group.pairs],
    []
  );
}

function getParticipantsFromPairsForRole(
  role: 'leader' | 'follower',
  pairs: Array<Pair>
): Array<string> {
  return pairs.map(pair => pair[role]).filter(Boolean);
}

function scoresForParticipants(
  participantIds: Array<string>,
  roundScores: Array<Score>
): Array<number> {
  return roundScores
    .map(score => {
      const participantId: ?string = participantIds.find(
        participantId => participantId === score.participantId
      );
      if (participantId == null) {
        return null;
      }
      return score.score;
    })
    .filter(Boolean);
}

function isScoreDraw(
  passingCouplesCount: number,
  scores: Array<number>
): boolean {
  return (
    scores.length > passingCouplesCount &&
    scores[passingCouplesCount - 1] === scores[passingCouplesCount]
  );
}

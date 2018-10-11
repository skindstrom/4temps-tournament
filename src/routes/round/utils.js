// @flow

function parseRound(bodyRound: mixed): Round {
  let round: Round = {
    id: '',
    name: '',
    danceCount: -1,
    minPairCountPerGroup: -1,
    maxPairCountPerGroup: -1,
    passingCouplesCount: -1,
    tieRule: 'none',
    roundScoringRule: 'none',
    multipleDanceScoringRule: 'none',
    criteria: [],
    groups: [],
    active: false,
    finished: false,
    draw: false,
    roundScores: [],
    winners: { leaders: [], followers: [] }
  };

  if (typeof bodyRound === 'object' && bodyRound != null) {
    for (const key in bodyRound) {
      if (key in round && bodyRound[key] != undefined) {
        round[key] = bodyRound[key];
      }
    }
  }
  return round;
}

export default parseRound;

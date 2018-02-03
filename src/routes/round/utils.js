// @flow

function parseRound(bodyRound: mixed): Round {
  let round: Round = {
    _id: '',
    name: '',
    danceCount: -1,
    minPairCount: -1,
    maxPairCount: -1,
    tieRule: 'none',
    roundScoringRule: 'none',
    multipleDanceScoringRule: 'none',
    criteria: [],
    groups: []
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

// @flow

import DanceScorer from './dance-scorer';

export default class RoundScorer {
  _round: Round;

  constructor(round: Round) {
    this._round = round;
  }

  scoreRound = (
    notes: Array<JudgeNote>
  ): Array<{
    participantId: string,
    score: number
  }> => {
    const danceScorer = new DanceScorer(notes);
    const totals: { [id: string]: Array<number> } = this._initializeTotals(
      this._getParticipants()
    );

    for (const dance of this._getDances()) {
      const danceScore = danceScorer.scoreDance(dance.id);
      for (const entry of danceScore) {
        const participantId = entry.participantId;
        if (totals[participantId]) {
          totals[participantId].push(entry.score);
        } else {
          totals[participantId] = [entry.score];
        }
      }
    }

    return Object.keys(totals)
      .map(participantId => ({
        participantId,
        score: this._scoreFromDanceRule(totals[participantId])
      }))
      .sort((a, b) => b.score - a.score);
  };

  _getParticipants = (): Array<string> => {
    return this._round.groups.reduce(
      (pairs, group) => [
        ...pairs,
        ...group.pairs.reduce((acc, pair) => {
          const arr = [];
          if (pair.follower != null) {
            arr.push(pair.follower);
          }
          if (pair.leader != null) {
            arr.push(pair.leader);
          }
          return [...acc, ...arr];
        }, [])
      ],
      []
    );
  };

  _initializeTotals = (
    participants: Array<string>
  ): { [id: string]: Array<number> } => {
    return participants.reduce((totals, id) => ({ ...totals, [id]: [0] }), {});
  };

  _scoreFromDanceRule = (danceScores: Array<number>) => {
    if (this._round.danceScoringRule === 'average') {
      return (
        danceScores.reduce((acc, score) => acc + score, 0) *
        1.0 /
        danceScores.length
      );
    }
    return Math.max(...danceScores);
  };

  _getDances = (): Array<Dance> => {
    let dances: Array<Dance> = [];

    this._round.groups.forEach(g => {
      dances = [...dances, ...g.dances];
    });

    return dances;
  };
}

// @flow

import DanceScorer from './dance-scorer';

export default class RoundScorer {
  _participants: Array<Participant>;
  _round: Round;

  constructor(participants: Array<Participant>, round: Round) {
    this._participants = participants;
    this._round = round;
  }

  scoreRound = (
    notes: Array<JudgeNote>
  ): Array<{
    participant: Participant,
    score: number
  }> => {
    const danceScorer = new DanceScorer(this._participants, notes);
    const totals: { [id: string]: Array<number> } = {};

    for (const dance of this._getDances()) {
      const danceScore = danceScorer.scoreDance(dance.id);
      for (const entry of danceScore) {
        const participantId = entry.participant.id;
        if (totals[participantId]) {
          totals[participantId].push(entry.score);
        } else {
          totals[participantId] = [entry.score];
        }
      }
    }

    return Object.keys(totals)
      .map(participantId => ({
        // $FlowFixMe: Participant will surely exist
        participant: this._participants.find(p => p.id === participantId),
        score: this._scoreFromDanceRule(totals[participantId])
      }))
      .sort((a, b) => b.score - a.score);
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

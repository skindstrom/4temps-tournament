// @flow
import RoundScorer from './round-scorer';

type Score = {
  participantId: string,
  score: number
};

type Role = 'leader' | 'follower';

class WinnerPicker {
  _round: Round;

  constructor(round: Round) {
    this._round = round;
  }

  pickWinners = (
    notes: Array<JudgeNote>
  ): { leaders: Array<Score>, followers: Array<Score> } => {
    const scores = this._getScores(notes);

    return {
      leaders: this._pickTopLeaders(scores),
      followers: this._pickTopFollowers(scores)
    };
  };

  _getScores = (notes: Array<JudgeNote>) => {
    const scorer = new RoundScorer(this._round);
    return scorer.scoreRound(notes);
  };

  _pickTopLeaders = (scores: Array<Score>): Array<Score> => {
    return this._pickTopRole(scores, 'leader');
  };

  _pickTopFollowers = (scores: Array<Score>): Array<Score> => {
    return this._pickTopRole(scores, 'follower');
  };

  _pickTopRole = (scores: Array<Score>, role: Role) => {
    const participants = this._getRole(role);
    const top: Array<Score> = [];
    for (const score of scores) {
      if (participants.includes(score.participantId)) {
        top.push(score);
      }

      if (top.length === this._round.passingCouplesCount) {
        break;
      }
    }

    return top;
  };
  _getRole = (role: Role): Array<string> => {
    return this._round.groups.reduce(
      (leaders, group) => [
        ...leaders,
        // $FlowFixMe
        ...group.pairs.reduce((leaders, pair) => [...leaders, pair[role]], [])
      ],
      []
    );
  };
}

export default WinnerPicker;

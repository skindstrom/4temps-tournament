// @flow
import RoundScorer from './round-scorer';

type Score = {
  participantId: string,
  score: number
};

type Role = 'leader' | 'follower';

class WinnerPicker {
  _judges: Array<Judge>;
  _round: Round;

  constructor(judges: Array<Judge>, round: Round) {
    this._judges = judges;
    this._round = round;
  }

  pickWinners = (
    notes: Array<JudgeNote>
  ): { leaders: Array<string>, followers: Array<string> } => {
    const roundScores = this._getScores(notes);

    return {
      leaders: this._pickTopLeaders(roundScores),
      followers: this._pickTopFollowers(roundScores)
    };
  };

  _getScores = (notes: Array<JudgeNote>) => {
    const scorer = new RoundScorer(this._judges, this._round);
    return scorer.scoreRound(notes);
  };

  _pickTopLeaders = (roundScores: Array<Score>): Array<string> => {
    return this._pickTopRole(roundScores, 'leader');
  };

  _pickTopFollowers = (roundScores: Array<Score>): Array<string> => {
    return this._pickTopRole(roundScores, 'follower');
  };

  _pickTopRole = (roundScores: Array<Score>, role: Role) => {
    const participants = this._getRole(role);
    const top: Array<string> = [];
    for (const score of roundScores) {
      if (participants.includes(score.participantId)) {
        top.push(score.participantId);
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

// @flow

type Role = 'leader' | 'follower';

export default class NoteChecker {
  _tournament: Tournament;

  constructor(tournament: Tournament) {
    this._tournament = tournament;
  }

  allSetForDance = (danceId: string, notes: Array<JudgeNote>) => {
    return this._tournament.judges.reduce(
      (accumulator, judge) =>
        accumulator &&
        this._isAllLeadersNotedInDanceByJudge(notes, danceId, judge.id) &&
        this._isAllFollowersNotedInDanceByJudge(notes, danceId, judge.id),
      true
    );
  };

  allSetForDanceByJudge = (
    danceId: string,
    notes: Array<JudgeNote>,
    judgeId: string
  ) => {
    return (
      this._isAllLeadersNotedInDanceByJudge(notes, danceId, judgeId) &&
      this._isAllFollowersNotedInDanceByJudge(notes, danceId, judgeId)
    );
  };

  _getLeadersInDance = (danceId: string): Array<string> =>
    this._getRoleInDance(danceId, 'leader');

  _getFollowersInDance = (danceId: string): Array<string> =>
    this._getRoleInDance(danceId, 'follower');

  _getRoleInDance = (danceId: string, role: Role): Array<string> => {
    for (const round of this._tournament.rounds) {
      for (const group of round.groups) {
        if (group.dances.findIndex(({ id }) => id == danceId) != -1) {
          // $FlowFixMe
          return group.pairs.map(pair => pair[role]).filter(id => id != null);
        }
      }
    }
    throw new DanceNotFoundError();
  };

  _getCriteriaForLeaders = (): Array<string> =>
    this._getCriteriaForRole('leader');

  _getCriteriaForFollowers = (): Array<string> =>
    this._getCriteriaForRole('follower');

  _getCriteriaForRole = (role: Role): Array<string> => {
    return this._getActiveRound()
      .criteria.filter(
        criterion =>
          criterion.type !== (role === 'leader' ? 'follower' : 'leader')
      )
      .map(({ id }) => id);
  };

  _getActiveRound = (): Round => {
    for (const round of this._tournament.rounds) {
      if (round.active) {
        return round;
      }
    }
    throw new NoActiveRoundError();
  };

  _isAllLeadersNotedInDanceByJudge = (
    notes: Array<JudgeNote>,
    danceId: string,
    judgeId: string
  ) => {
    const leaders = this._getLeadersInDance(danceId);
    const criteria = this._getCriteriaForLeaders();
    return this._isAllParticipantsNotedInDanceByJudge(
      leaders,
      criteria,
      notes,
      danceId,
      judgeId
    );
  };

  _isAllFollowersNotedInDanceByJudge = (
    notes: Array<JudgeNote>,
    danceId: string,
    judgeId: string
  ) => {
    const followers = this._getFollowersInDance(danceId);
    const criteria = this._getCriteriaForFollowers();
    return this._isAllParticipantsNotedInDanceByJudge(
      followers,
      criteria,
      notes,
      danceId,
      judgeId
    );
  };

  _isAllParticipantsNotedInDanceByJudge = (
    participants: Array<string>,
    criteria: Array<string>,
    notes: Array<JudgeNote>,
    danceId: string,
    judgeId: string
  ) => {
    for (const participantId of participants) {
      for (const criterionId of criteria) {
        if (
          notes.find(({ value, ...rest }) => {
            return (
              judgeId === rest.judgeId &&
              danceId === rest.danceId &&
              participantId === rest.participantId &&
              criterionId === rest.criterionId
            );
          }) == null
        ) {
          return false;
        }
      }
    }
    return true;
  };
}

function DanceNotFoundError() {}
function NoActiveRoundError() {}

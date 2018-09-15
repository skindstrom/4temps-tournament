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

  _getJudgeTypeForJudgeId = (id: string): JudgeType => {
    const judge = this._tournament.judges.find(judge => judge.id === id);
    if (!judge) {
      throw new JudgeNotFoundError();
    }

    return judge.type;
  };

  _getCriteriaForJudgeType = (type: JudgeType): Array<string> => {
    return this._getActiveRound()
      .criteria.filter(criterion => criterion.forJudgeType === type)
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
    return this._isAllParticipantsNotedInDanceByJudge(
      leaders,
      this._getCriteriaForJudgeType(this._getJudgeTypeForJudgeId(judgeId)),
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
    return this._isAllParticipantsNotedInDanceByJudge(
      followers,
      this._getCriteriaForJudgeType(this._getJudgeTypeForJudgeId(judgeId)),
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
    const noteSet = new Set(notes.map(note => hashNote(note)));
    for (const participantId of participants) {
      for (const criterionId of criteria) {
        const supposedNote = { judgeId, danceId, participantId, criterionId };
        if (!noteSet.has(hashNote(supposedNote))) {
          return false;
        }
      }
    }
    return true;
  };
}

function hashNote({
  judgeId,
  danceId,
  participantId,
  criterionId
}: {
  judgeId: string,
  danceId: string,
  participantId: string,
  criterionId: string
}) {
  return `${judgeId}:${danceId}:${participantId}:${criterionId}`;
}

function DanceNotFoundError() {}
function NoActiveRoundError() {}
function JudgeNotFoundError() {}

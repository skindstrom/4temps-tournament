// @flow

class DanceScorer {
  _judges: Array<Judge>;
  _criteria: { [id: string]: RoundCriterion };
  _notes: Array<JudgeNote>;

  constructor(
    judges: Array<Judge>,
    criteria: Array<RoundCriterion>,
    notes: Array<JudgeNote>
  ) {
    this._judges = judges;
    this._criteria = criteria.reduce(
      (acc, crit) => ({ ...acc, [crit.id]: crit }),
      {}
    );
    this._notes = notes;
  }

  scoreDance = (
    danceId: string
  ): Array<{
    participantId: string,
    score: number
  }> => {
    const notesForDance = this._notes.filter(note => note.danceId === danceId);
    const positives = this._getPositiveTotal(notesForDance);
    const negatives = this._getNegativeTotal(notesForDance);

    const sum = this._sum(positives, negatives);

    return Object.keys(sum)
      .map(participantId => {
        return {
          participantId,
          score: sum[participantId]
        };
      })
      .sort(this._sort);
  };

  _getPositiveTotal = (
    notesForDance: Array<JudgeNote>
  ): { [id: string]: number } => {
    const totals = {};
    notesForDance
      .filter(
        ({ criterionId }) =>
          this._criteria[criterionId].forJudgeType === 'normal'
      )
      .forEach(note => this._addNoteToTotal(note, totals));

    return totals;
  };

  _addNoteToTotal = (note: JudgeNote, total: { [id: string]: number }) => {
    const participantId = note.participantId;
    if (total[participantId]) {
      total[participantId] += note.value;
    } else {
      total[participantId] = note.value;
    }
  };

  _getNegativeTotal = (
    notesForDance: Array<JudgeNote>
  ): { [id: string]: number } => {
    const maxScoreForParticipants = this._maxScoreForParticipants();

    return notesForDance
      .filter(
        ({ criterionId }) =>
          this._criteria[criterionId].forJudgeType === 'sanctioner'
      )
      .reduce(
        (acc, { participantId, value }) => ({
          ...acc,
          [participantId]:
            (acc[participantId] || 0) +
            this._malusFromValueAndMaxScore(value, maxScoreForParticipants)
        }),
        {}
      );
  };

  _maxScoreForParticipants = () => {
    const criteriaForNormalJudges = Object.keys(this._criteria)
      .map(key => this._criteria[key])
      .filter(({ forJudgeType }) => forJudgeType === 'normal');

    const normalJudges = this._judges.filter(({ type }) => type === 'normal');

    return (
      criteriaForNormalJudges.reduce((acc, { maxValue }) => acc + maxValue, 0) *
      normalJudges.length
    );
  };

  _malusFromValueAndMaxScore = (value: number, maxScore: number) => {
    return Math.round(maxScore * (1 - (100 - value) / 100));
  };

  _sum = (
    positives: { [id: string]: number },
    negatives: { [id: string]: number }
  ) => {
    return Object.keys(positives).reduce(
      (acc, key) => ({
        ...acc,
        [key]: Math.max(positives[key] - (negatives[key] || 0), 0)
      }),
      {}
    );
  };

  _sort = (a: Score, b: Score) => {
    if (a.score == b.score) {
      return Math.random() - 0.5;
    }
    return b.score - a.score;
  };
}

export default DanceScorer;

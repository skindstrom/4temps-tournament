// @flow

class DanceScorer {
  _judges: Array<Judge>;
  _criteria: { [id: string]: RoundCriterion };
  _notes: Array<JudgeNote>;
  _allowNegative: boolean;
  _countPresident: boolean;

  constructor(
    judges: Array<Judge>,
    criteria: Array<RoundCriterion>,
    notes: Array<JudgeNote>,
    {
      allowNegative,
      countPresident
    }: { allowNegative: boolean, countPresident: boolean } = {
      allowNegative: false,
      countPresident: false
    }
  ) {
    this._judges = judges;
    this._criteria = criteria.reduce(
      (acc, crit) => ({ ...acc, [crit.id]: crit }),
      {}
    );
    this._notes = notes;
    this._allowNegative = allowNegative;
    this._countPresident = countPresident;
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
      .filter(note => {
        const judge: ?Judge = this._judges.find(
          judge => judge.id === note.judgeId
        );
        return (
          judge != null &&
          (judge.judgeType === 'normal' ||
            (this._countPresident && judge.judgeType === 'president'))
        );
      })
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

    const normalJudges = this._judges.filter(
      ({ judgeType }) => judgeType === 'normal'
    );

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
    return [...Object.keys(positives), ...Object.keys(negatives)].reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          this._allowNegative === true
            ? (positives[key] || 0) - (negatives[key] || 0)
            : Math.max((positives[key] || 0) - (negatives[key] || 0), 0)
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

// @flow

class DanceScorer {
  _notes: Array<JudgeNote>;

  constructor(notes: Array<JudgeNote>) {
    this._notes = notes;
  }

  scoreDance = (
    danceId: string
  ): Array<{
    participantId: string,
    score: number
  }> => {
    const notesForDance = this._notes.filter(note => note.danceId === danceId);

    const totals = {};
    notesForDance.forEach(note => this._addNoteToTotal(note, totals));

    return Object.keys(totals)
      .map(participantId => {
        return {
          participantId,
          score: totals[participantId]
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  _addNoteToTotal = (note: JudgeNote, total: { [id: string]: number }) => {
    const participantId = note.participantId;
    if (total[participantId]) {
      total[participantId] += note.value;
    } else {
      total[participantId] = note.value;
    }
  };
}

export default DanceScorer;

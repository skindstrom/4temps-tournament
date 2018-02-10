// @flow

class DanceScorer {
  _participants: Array<Participant>;
  _notes: Array<JudgeNote>;

  constructor(participants: Array<Participant>, notes: Array<JudgeNote>) {
    this._participants = participants;
    this._notes = notes;
  }

  scoreDance = (danceId: string): Array<{
    participant: Participant, score: number
    }> => {
    const notesForDance = this._notes.filter(note => note.danceId === danceId);

    const totals = {};
    notesForDance.forEach((note) => this._addNoteToTotal(note, totals));

    return Object.keys(totals).map(participantId => ({
      participant: this._participants
        .find(p => p.id === participantId),
      score: totals[participantId]
    }))
      .sort((a, b) => b.score - a.score);
  }

  _addNoteToTotal= (note: JudgeNote, total: {[id: string]: number}) => {
    const participantId = note.participantId;
    if (total[participantId]) {
      total[participantId] += note.value;
    } else {
      total[participantId] = note.value;
    }
  }

}

export default DanceScorer;
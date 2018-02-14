// @flow

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  danceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  criterionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const TempModel = mongoose.model('tempNote', schema);
const SubmittedModel = mongoose.model('submittedNote', schema);

export interface NoteRepository {
  createOrUpdate(note: JudgeNote): Promise<void>;
  getForDance(danceId: string): Promise<Array<JudgeNote>>;
}

export class TemporaryNoteRepository implements NoteRepository {
  async createOrUpdate(note: JudgeNote) {
    const { value, ...ids } = note;
    await TempModel.update({ ...ids }, { ...note }, { upsert: true });
  }

  async getForDance(danceId: string) {
    return await TempModel.find({ danceId });
  }
}

export class SubmittedNoteRepository implements NoteRepository {
  async createOrUpdate(note: JudgeNote) {
    const { value, ...ids } = note;
    await SubmittedModel.update({ ...ids }, note, { upsert: true });
  }
  async getForDance(danceId: string) {
    return await TempModel.find({ danceId });
  }
}

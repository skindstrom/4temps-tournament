// @flow

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  danceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  criterionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: Number,
    required: true
  }
});

const Model = mongoose.model('note', schema);

export interface NoteRepository {
  createOrUpdate(note: JudgeNote): Promise<void>;
}

class NoteRepositoryImpl implements NoteRepository {
  async createOrUpdate(note: JudgeNote) {
    const { value, ...ids } = note;
    await Model.findOneAndUpdate({ ...ids }, note, { upsert: true });
  }
}

export default NoteRepositoryImpl;
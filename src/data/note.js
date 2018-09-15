// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

type NoteDbModel = {
  judgeId: ObjectId,
  danceId: ObjectId,
  criterionId: ObjectId,
  participantId: ObjectId,
  value: number
};

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
  delete(note: JudgeNote): Promise<void>;
}

export class TemporaryNoteRepository implements NoteRepository {
  async createOrUpdate(note: JudgeNote) {
    const { value, ...ids } = note;
    await TempModel.update({ ...ids }, { ...note }, { upsert: true });
  }

  async getForDance(danceId: string) {
    return (await TempModel.find({ danceId })).map(a =>
      mapToDomainModel(a.toObject())
    );
  }

  async delete(note: JudgeNote) {
    const { value, ...ids } = note;
    return await TempModel.deleteOne(ids);
  }
}

export class SubmittedNoteRepository implements NoteRepository {
  async createOrUpdate(note: JudgeNote) {
    const { value, ...ids } = note;
    await SubmittedModel.update({ ...ids }, note, { upsert: true });
  }
  async getForDance(danceId: string) {
    return (await SubmittedModel.find({ danceId })).map(a =>
      mapToDomainModel(a.toObject())
    );
  }

  async delete(note: JudgeNote) {
    const { value, ...ids } = note;
    return await TempModel.deleteOne(ids);
  }
}

function mapToDomainModel(note: NoteDbModel): JudgeNote {
  return {
    judgeId: note.judgeId.toString(),
    danceId: note.danceId.toString(),
    criterionId: note.criterionId.toString(),
    participantId: note.participantId.toString(),
    value: note.value
  };
}

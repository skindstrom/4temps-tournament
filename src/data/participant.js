// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type ParticipantDbModel = {
  _id: ObjectId,
  name: string,
  role: ParticipantRole,
  attendanceId: number,
  isAttending: boolean
};

export const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  attendanceId: {
    type: Number,
    required: false
  },
  isAttending: {
    type: Boolean,
    required: true
  }
});

export function mapToDomainModel(participant: ParticipantDbModel): Participant {
  const { _id, ...rest } = participant;
  return { id: _id.toString(), ...rest };
}

export function mapToDbModel(participant: Participant): ParticipantDbModel {
  const { id, ...rest } = participant;
  return {
    _id: new mongoose.Types.ObjectId(id),
    ...rest
  };
}

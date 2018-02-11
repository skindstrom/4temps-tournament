// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type ParticipantDbModel = {
  _id: ObjectId,
  name: string,
  role: ParticipantRole,
  isAttending: boolean
};

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

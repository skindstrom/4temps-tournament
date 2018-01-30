// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Participant, Role } from '../models/participant';

export type ParticipantDbModel = {
  _id: ObjectId,
  name: string,
  role: Role
}

export const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
});

export function mapToDomainModel(
  participant: ParticipantDbModel): Participant {
  const {_id, name, role} = participant;
  return { _id: _id.toString(), name, role };
}

export function mapToDbModel(
  participant: Participant): ParticipantDbModel {
  const {_id, name, role} = participant;
  return {
    _id: new mongoose.Types.ObjectId(_id),
    name,
    role
  };
}

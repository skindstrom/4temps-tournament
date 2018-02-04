// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Participant, Role } from '../models/participant';

export type ParticipantDbModel = {
  _id: ObjectId,
  name: string,
  role: Role
}

export function mapToDomainModel(
  participant: ParticipantDbModel): Participant {
  const {_id, name, role} = participant;
  return { id: _id.toString(), name, role };
}

export function mapToDbModel(
  participant: Participant): ParticipantDbModel {
  const {id, name, role} = participant;
  return {
    _id: new mongoose.Types.ObjectId(id),
    name,
    role
  };
}

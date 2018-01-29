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

const Model = mongoose.model('participant', schema);

export interface ParticipantRepository {
  createForTournament(tournamentId: string,
    participant: Participant): Promise<void>;
  getForTournament(tournamentId: string): Promise<Array<Participant>>;
}

class ParticipantRepositoryImpl implements ParticipantRepository {
  async createForTournament(
    tournamentId: string,
    participant: Participant) {
    if (!mongoose.Types.ObjectId.isValid(participant._id)) {
      participant._id = new mongoose.Types.ObjectId().toString();
    }
    await Model.create(mapToOldDbModel(tournamentId, participant));
  }

  async getForTournament(
    tournamentId: string): Promise<Array<Participant>> {

    return (await Model.find({ tournamentId })).map(mapToDomainModel);
  }
}

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

function mapToOldDbModel(
  tournamentId: string, participant: Participant) {
  const {_id, name, role} = participant;
  return {
    _id: new mongoose.Types.ObjectId(_id),
    tournamentId: new mongoose.Types.ObjectId(tournamentId),
    name,
    role
  };
}

export default ParticipantRepositoryImpl;

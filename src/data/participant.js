// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Participant, Role } from '../models/participant';

export type ParticipantDbModel = {
  _id: ObjectId,
  tournamentId: ObjectId,
  name: string,
  role: Role
}

const schema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
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
    await Model.create(mapToDbModel(tournamentId, participant));
  }

  async getForTournament(
    tournamentId: string): Promise<Array<Participant>> {

    return (await Model.find({ tournamentId })).map(mapToDomainModel);
  }
}

function mapToDomainModel(participant: ParticipantDbModel): Participant {
  const {_id, name, role} = participant;
  return { _id: _id.toString(), name, role };
}

function mapToDbModel(
  tournamentId: string, participant: Participant): ParticipantDbModel {
  const {_id, name, role} = participant;
  return {
    _id: new mongoose.Types.ObjectId(_id),
    tournamentId: new mongoose.Types.ObjectId(tournamentId),
    name,
    role
  };
}

export default ParticipantRepositoryImpl;

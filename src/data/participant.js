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
  getForTournament(tournamentId: string): Promise<Array<ParticipantDbModel>>;
}

class ParticipantRepositoryImpl implements ParticipantRepository {
  createForTournament(tournamentId: string,
    participant: Participant) {
    return Model.create({
      tournamentId: new mongoose.Types.ObjectId(tournamentId),
      name: participant.name,
      role: participant.role
    });
  }

  getForTournament(
    tournamentId: string): Promise<Array<ParticipantDbModel>> {
    return Model.find({ tournamentId });
  }
}

export default ParticipantRepositoryImpl;
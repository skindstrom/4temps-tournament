// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import moment from 'moment';
import type { Tournament, TournamentType } from '../models/tournament';
import type {ParticipantDbModel} from './participant';
import {
  schema as ParticipantSchema,
  mapToDomainModel as mapParticipantToDomainModel,
  mapToDbModel as mapParticipantToDbModel
} from './participant';
import type {RoundDbModel} from './round';
import {
  schema as RoundSchema,
  mapToDomainModel as mapRoundToDomainModel,
  mapToDbModel as mapRoundToDbModel
} from './round';

type TournamentModel = {
  _id: ObjectId,
  creatorId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType,
  judges: Array<string>,
  participants: Array<ParticipantDbModel>,
  rounds: Array<RoundDbModel>
}

const schema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  judges: [String],
  participants: [ParticipantSchema],
  rounds: [RoundSchema]
});

const Model = mongoose.model('tournament', schema);

export interface TournamentRepository {
  create(tournament: Tournament): Promise<void>;
  get(id: string): Promise<?Tournament>;
  getAll(): Promise<Array<Tournament>>;
  getForUser(userId: string): Promise<Array<Tournament>>;
  update(tournament: Tournament): Promise<void>;

  createParticipant(
    tournamentId: string, participant: Participant): Promise<void>;

  createRound(
    tournamentId: string, round: Round): Promise<void>;
  deleteRound(tournamentId: string, roundId: string): Promise<void>;
}

export class TournamentRepositoryImpl implements TournamentRepository {
  async create(tournament: Tournament) {
    await Model.create(mapToDbModel(tournament));
  }
  async get(id: string) {
    return mapToDomainModel(await Model.findOne({ _id: id }));
  }
  async getAll() {
    try {
      return await Model.find();
    } catch (e) {
      return [];
    }
  }
  async getForUser(userId: string) {
    try {
      return await Model.find({ creatorId: userId });
    } catch (e) {
      return [];
    }
  }
  async update(tournament: Tournament) {
    // don't overwrite anything sensitive for now
    const {name, date} = mapToDbModel(tournament);
    await Model.update({ _id: tournament._id }, {
      $set: {name, date}
    });
  }
  async createParticipant(
    tournamentId: string, participant: Participant) {
    await Model.update(
      {_id: tournamentId},
      {
        $push: {
          participants: mapParticipantToDbModel(participant)
        }
      }
    );
  }
  async createRound(
    tournamentId: string, round: Round) {
    await Model.update(
      {_id: tournamentId},
      {
        $push: {
          rounds: mapRoundToDbModel(round)
        }
      }
    );
  }
  async deleteRound(tournamentId: string, roundId: string) {
    await Model.update(
      {_id: tournamentId, },
      {
        $pull: {
          rounds: {_id: roundId}
        }
      }
    );
  }
}

function mapToDbModel(tournament: Tournament): TournamentModel {
  const {
    _id,
    date,
    creatorId,
    participants,
    rounds,
    ...same
  } = tournament;
  return {
    ...same,
    _id: new mongoose.Types.ObjectId(_id),
    creatorId: new mongoose.Types.ObjectId(creatorId),
    date: date.toDate(),
    participants: participants.map(mapParticipantToDbModel),
    rounds: rounds.map(mapRoundToDbModel)
  };
}

function mapToDomainModel(tournament: TournamentModel): Tournament {
  const {
    _id,
    date,
    creatorId,
    participants,
    rounds,
    ...same
  } = tournament;
  return {
    ...same,
    _id: _id.toString(),
    creatorId: creatorId.toString(),
    date: moment(date),
    participants: participants.map(mapParticipantToDomainModel),
    rounds: rounds.map(mapRoundToDomainModel)
  };
}

export default TournamentRepositoryImpl;

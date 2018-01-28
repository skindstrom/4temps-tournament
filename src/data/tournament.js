// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import moment from 'moment';
import type { Tournament, TournamentType } from '../models/tournament';

type TournamentModel = {
  _id: ObjectId,
  creatorId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType,
  judges: Array<string>
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
  judges: [String]
});

const Model = mongoose.model('tournament', schema);

export const createTournament =
  async (userId: string, tournament: Tournament): Promise<void> => {
    await Model.create(mapToDbModel({...tournament, creatorId: userId}));
  };

export const updateTournament =
  async (tournamentId: string,
    tournament: Tournament): Promise<?Tournament> => {
    try {
      await Model.update({ _id: tournamentId }, {
        $set: mapToDbModel(tournament)
      });
      return tournament;
    } catch (e) {
      return null;
    }
  };

export const getTournamentsForUser =
  async (userId: string): Promise<Array<Tournament>> => {
    try {
      return await Model.find({ creatorId: userId });
    } catch (e) {
      return [];
    }
  };

export const getTournaments = async (): Promise<Array<Tournament>> => {
  try {
    return await Model.find();
  } catch (e) {
    return [];
  }
};

export const getTournament =
  async (tournamentId: string): Promise<?Tournament> => {
    try {
      return mapToDomainModel(await Model.findOne({ _id: tournamentId }));
    } catch (e) {
      return null;
    }
  };

export interface TournamentRepository {
  get(id: string): Promise<?Tournament>;
}

export class TournamentRepositoryImpl implements TournamentRepository {
  get(id: string) {
    return getTournament(id);
  }
}

function mapToDbModel(tournament: Tournament): TournamentModel {
  const {_id, name, date, type, judges, creatorId} = tournament;
  return {
    name,
    type,
    judges,
    _id: new mongoose.Types.ObjectId(_id),
    creatorId: new mongoose.Types.ObjectId(creatorId),
    date: date.toDate(),
  };
}

function mapToDomainModel(tournament: TournamentModel): Tournament {
  const {_id, name, date, type, judges, creatorId} = tournament;
  return {
    _id: _id.toString(),
    name,
    type,
    judges,
    creatorId: creatorId.toString(),
    date: moment(date),
  };
}

export default TournamentRepositoryImpl;

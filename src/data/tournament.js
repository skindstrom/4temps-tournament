// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import type { Tournament, TournamentType } from '../models/tournament';

export type TournamentModel = {
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType
}

const schema = new mongoose.Schema({
  userId: {
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
});

const Model = mongoose.model('tournament', schema);

export const createTournament =
  async (userId: ObjectId, tournament: Tournament): Promise<boolean> => {
    try {
      const { date, ...rest } = tournament;
      await Model.create({ userId, date: date.toDate(), ...rest });
      return true;
    } catch (e) {
      return false;
    }
  };

export const getTournamentsForUser =
  async (userId: ObjectId): Promise<Array<TournamentModel>> => {
    try {
      return await Model.find({ userId });
    } catch (e) {
      return [];
    }
  };
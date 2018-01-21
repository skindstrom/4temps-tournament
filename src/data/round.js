// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type RoundDbModel = Round & {
  _id: ObjectId | string,
  tournamentId: ObjectId | string
};


const schema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  danceCount: { type: Number, required: true },
  minPairCount: { type: Number, required: true },
  maxPairCount: { type: Number, required: true },
  tieRule: { type: String, required: true },
  roundScoringRule: { type: String, required: true },
  multipleDanceScoringRule: { type: String, required: true },
  criteria: [
    {
      name: String,
      minValue: Number,
      maxValue: Number,
      description: String,
      type: String
    }
  ]
});

const Model = mongoose.model('round', schema);

export interface RoundRepository {
  create(round: RoundDbModel): Promise<void>;
  getForTournament(tournamentId: string): Promise<Array<RoundDbModel>>;
}

export class RoundRepositoryImpl implements RoundRepository {
  async create(round: RoundDbModel) {
    return Model.create(round);
  }

  async getForTournament(tournamentId: string) {
    return Model.find({ tournamentId });
  }
}

export default RoundRepositoryImpl;
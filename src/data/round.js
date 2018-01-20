// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type RoundDbModel = Round & {
  _id: ObjectId | string,
  tournamentId: ObjectId | string
};


const schema = new mongoose.Schema({
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
}

export class RoundRepositoryImpl implements RoundRepository {
  async create(round: RoundDbModel) {
    return Model.create(round);
  }
}

export default RoundRepositoryImpl;
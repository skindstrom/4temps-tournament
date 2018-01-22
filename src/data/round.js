// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type RoundDbModel = Round & {
    _id: ObjectId,
};


const schema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  rounds: [{
    danceCount: {
      type: Number,
      required: true
    },
    minPairCount: {
      type: Number,
      required: true
    },
    maxPairCount: {
      type: Number,
      required: true
    },
    tieRule: {
      type: String,
      required: true
    },
    roundScoringRule: {
      type: String,
      required: true
    },
    multipleDanceScoringRule: {
      type: String,
      required: true
    },
    criteria: [{
      name: String,
      minValue: Number,
      maxValue: Number,
      description: String,
      type: {
        type: String
      }
    }]
  }]
});

const Model = mongoose.model('round', schema);

export interface RoundRepository {
    create(tournamentId: string, round: Round): Promise<void>;
    getForTournament(tournamentId: string): Promise<Array<Round>>;
    update(tournamentId: string, rounds: Array<Round>): Promise<void>;
}

export class RoundRepositoryImpl implements RoundRepository {
  async create(tournamentId: string, round: Round) {
    Model.findOneAndUpdate({tournamentId}, {
      $push: {
        rounds: round
      }
    });
  }

  async getForTournament(tournamentId: string) {
    return (await Model.find({tournamentId}).rounds) || [];
  }

  async update(tournamentId: string, rounds: Array<Round> ) {
    Model.update({tournamentId}, { $set: {rounds} });
  }
}

export default RoundRepositoryImpl;

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
  index: { type: Number, required: true },
  name: {type: String, required: true},
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
    name: {type: String, required: true},
    minValue: {type: Number, required: true},
    maxValue: {type: Number, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true}
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
    const rounds = await Model.find({tournamentId});
    const index = rounds.length;

    await Model.create({tournamentId, index , ...round});
  }

  async getForTournament(tournamentId: string) {
    const rounds = await Model.find({tournamentId});
    return rounds.sort((a, b) => a.index > b.index);
  }

  async update(tournamentId: string, newRounds: Array<Round> ) {
    const prevRounds = await Model.find({tournamentId});
    const newIds = new Set(newRounds.map(({_id}) => _id));
    const prevIds = prevRounds.map(({_id}) => _id.toString());

    const toDelete = prevIds.filter(id => !newIds.has(id));

    for (const id of toDelete) {
      await Model.remove({_id: id});
    }

    for (let i = 0; i < newRounds.length; ++i) {
      const round = newRounds[i];
      await Model.update({_id: round._id}, {...round, index: i});
    }
  }
}

export default RoundRepositoryImpl;

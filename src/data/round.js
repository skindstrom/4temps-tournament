// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

export type RoundDbModel = {
  _id: ObjectId,
  name: string,
  danceCount: number,
  minPairCount: number,
  maxPairCount: number,
  tieRule: 'none' | 'random' | 'all',
  roundScoringRule: 'none' | 'average' | 'averageWithoutOutliers',
  multipleDanceScoringRule: 'none' | 'average' | 'best' | 'worst',
  criteria: Array<RoundCriterion>,
  active: boolean,
  finished: boolean,
  groups: Array<DanceGroupDbModel>
};

type DanceGroupDbModel = {
  pairs: Array<{follower: ?ObjectId, leader: ?ObjectId}>
}


export const schema = new mongoose.Schema({
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
  }],
  active: {
    type: Boolean, required: true
  },
  finished: {
    type: Boolean, required: true
  },
  groups: [{
    pairs: [{
      follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },
      leader: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },
    }]
  }]
});

export function mapToDomainModel(round: RoundDbModel): Round {
  const {
    _id,
    groups,
    ...same
  } = round;

  return {
    id: _id.toString(),
    groups: groups.map(g => ({
      pairs:
        g.pairs.map(p => ({
          follower: p.follower == null ? null : p.follower.toString(),
          leader: p.leader == null ? null : p.leader.toString(),
        }))
    })),
    ...same
  };
}

export function mapToDbModel(round: Round): RoundDbModel {
  const {
    id,
    groups,
    ...same
  } = round;

  return {
    _id: new mongoose.Types.ObjectId(id),
    groups: groups.map(g => ({
      pairs:
        g.pairs.map(p => ({
          follower: p.follower == null ? null :
            new mongoose.Types.ObjectId(p.follower),
          leader: p.leader == null ? null :
            new mongoose.Types.ObjectId(p.leader),
        }))
    })),
    ...same
  };
}

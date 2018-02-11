// @flow

import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

type CriterionDbModel = {
  _id: ObjectId,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  type: 'none' | 'both' | 'one' | 'follower' | 'leader'
};

export type RoundDbModel = {
  _id: ObjectId,
  name: string,
  danceCount: number,
  minPairCountPerGroup: number,
  maxPairCountPerGroup: number,
  passingParticipantsCount: number,
  tieRule: 'none' | 'random' | 'all',
  roundScoringRule: 'none' | 'average' | 'averageWithoutOutliers',
  multipleDanceScoringRule: 'none' | 'average' | 'best' | 'worst',
  criteria: Array<CriterionDbModel>,
  active: boolean,
  finished: boolean,
  groups: Array<DanceGroupDbModel>
};

type DanceGroupDbModel = {
  _id: ObjectId,
  pairs: Array<{ follower: ?ObjectId, leader: ?ObjectId }>,
  dances: Array<DanceDbModel>
};

type DanceDbModel = {
  _id: ObjectId,
  active: boolean,
  finished: boolean
};

const danceSchema = new mongoose.Schema({
  active: Boolean,
  finished: Boolean
});

const groupSchema = new mongoose.Schema({
  pairs: [
    {
      follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },
      leader: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      }
    }
  ],
  dances: [danceSchema]
});

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  danceCount: {
    type: Number,
    required: true
  },
  minPairCountPerGroup: {
    type: Number,
    required: true
  },
  maxPairCountPerGroup: {
    type: Number,
    required: true
  },
  passingParticipantsCount: {
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
  criteria: [
    {
      name: { type: String, required: true },
      minValue: { type: Number, required: true },
      maxValue: { type: Number, required: true },
      description: { type: String, required: true },
      type: { type: String, required: true }
    }
  ],
  active: {
    type: Boolean,
    required: true
  },
  finished: {
    type: Boolean,
    required: true
  },
  groups: [groupSchema]
});

export function mapToDomainModel(round: RoundDbModel): Round {
  const { _id, groups, criteria, ...same } = round;

  return {
    id: _id.toString(),
    criteria: criteria.map(({ _id, ...sameCrit }) => ({
      id: _id.toString(),
      ...sameCrit
    })),
    groups: groups.map(g => ({
      id: g._id.toString(),
      pairs: g.pairs.map(p => ({
        follower: p.follower == null ? null : p.follower.toString(),
        leader: p.leader == null ? null : p.leader.toString()
      })),
      dances: g.dances.map(d => ({
        id: d._id.toString(),
        active: d.active,
        finished: d.finished
      }))
    })),
    ...same
  };
}

export function mapToDbModel(round: Round): RoundDbModel {
  const { id, groups, criteria, ...same } = round;

  return {
    _id: new mongoose.Types.ObjectId(id),
    criteria: criteria.map(({ id, ...sameCrit }) => ({
      _id: new mongoose.Types.ObjectId(id),
      ...sameCrit
    })),
    groups: groups.map(g => ({
      _id: new mongoose.Types.ObjectId(g.id),
      pairs: g.pairs.map(p => ({
        follower:
          p.follower == null ? null : new mongoose.Types.ObjectId(p.follower),
        leader: p.leader == null ? null : new mongoose.Types.ObjectId(p.leader)
      })),
      dances: g.dances.map(d => ({
        _id: new mongoose.Types.ObjectId(d.id),
        active: d.active,
        finished: d.finished
      }))
    })),
    ...same
  };
}

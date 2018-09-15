// @flow

import ObjectId from 'bson-objectid';

export type RouteResult<T> = Promise<{
  status: number,
  body: T
}>;

// eslint-disable-next-line
export function createMalusCriterion(): RoundCriterion {
  return {
    id: ObjectId.generate(),
    name: 'Malus',
    description: 'Negative points in percentage of maximum possible score',
    minValue: 0,
    maxValue: 100,
    forJudgeType: 'sanctioner'
  };
}

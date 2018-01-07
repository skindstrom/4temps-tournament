// @flow

export type Role = 'none' | 'leader' | 'follower' | 'leaderAndFollower';

export type Participant = {
  _id: string,
  name: string,
  role: Role
};
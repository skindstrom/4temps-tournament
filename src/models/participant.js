// @flow

export type Role = 'none' | 'leader' | 'follower' | 'leaderAndFollower';

export type Participant = {
  name: string,
  role: Role
};
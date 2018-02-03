// @flow

export type Role = 'none' | 'leader' | 'follower' | 'leaderAndFollower';

export type Participant = {
  id: string,
  name: string,
  role: Role
};
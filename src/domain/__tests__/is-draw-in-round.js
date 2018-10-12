// @flow
import isDrawInRound from '../is-draw-in-round';
import { createRound } from '../../test-utils';

it('Returns false if no groups in round', () => {
  const round: Round = { ...createRound(), groups: [], roundScores: [] };

  expect(isDrawInRound(round)).toBe(false);
});

it('Returns true if both leaders and followers have a draw', () => {
  const leaderId1 = 'l1';
  const leaderId2 = 'l2';
  const followerId1 = 'f1';
  const followerId2 = 'f2';

  const scores: Array<Score> = [
    { participantId: leaderId1, score: 1 },
    { participantId: leaderId2, score: 1 },
    { participantId: followerId1, score: 1 },
    { participantId: followerId2, score: 1 }
  ];

  const pairs: Array<Pair> = [
    { leader: leaderId1, follower: followerId1 },
    { leader: leaderId2, follower: followerId2 }
  ];
  const group: DanceGroup = { id: 'group', dances: [], pairs };
  const round: Round = {
    ...createRound(),
    passingCouplesCount: 1,
    groups: [group],
    roundScores: scores
  };

  expect(isDrawInRound(round)).toBe(true);
});

it('Returns true if only leaders have a draw', () => {
  const leaderId1 = 'l1';
  const leaderId2 = 'l2';
  const followerId1 = 'f1';
  const followerId2 = 'f2';

  const scores: Array<Score> = [
    { participantId: leaderId1, score: 1 },
    { participantId: leaderId2, score: 1 },
    { participantId: followerId1, score: 100 },
    { participantId: followerId2, score: 1 }
  ];

  const pairs: Array<Pair> = [
    { leader: leaderId1, follower: followerId1 },
    { leader: leaderId2, follower: followerId2 }
  ];
  const group: DanceGroup = { id: 'group', dances: [], pairs };
  const round: Round = {
    ...createRound(),
    passingCouplesCount: 1,
    groups: [group],
    roundScores: scores
  };

  expect(isDrawInRound(round)).toBe(true);
});

it('Returns true if only followers have a draw', () => {
  const leaderId1 = 'l1';
  const leaderId2 = 'l2';
  const followerId1 = 'f1';
  const followerId2 = 'f2';

  const scores: Array<Score> = [
    { participantId: leaderId1, score: 100 },
    { participantId: leaderId2, score: 1 },
    { participantId: followerId1, score: 1 },
    { participantId: followerId2, score: 1 }
  ];

  const pairs: Array<Pair> = [
    { leader: leaderId1, follower: followerId1 },
    { leader: leaderId2, follower: followerId2 }
  ];
  const group: DanceGroup = { id: 'group', dances: [], pairs };
  const round: Round = {
    ...createRound(),
    passingCouplesCount: 1,
    groups: [group],
    roundScores: scores
  };

  expect(isDrawInRound(round)).toBe(true);
});

it('Returns false if draw, if there are fewer winners than the maximum passing couples', () => {
  const leaderId1 = 'l1';
  const leaderId2 = 'l2';
  const followerId1 = 'f1';
  const followerId2 = 'f2';

  const scores: Array<Score> = [
    { participantId: leaderId1, score: 1 },
    { participantId: leaderId2, score: 1 },
    { participantId: followerId1, score: 1 },
    { participantId: followerId2, score: 1 }
  ];

  const pairs: Array<Pair> = [
    { leader: leaderId1, follower: followerId1 },
    { leader: leaderId2, follower: followerId2 }
  ];
  const group: DanceGroup = { id: 'group', dances: [], pairs };
  const round: Round = {
    ...createRound(),
    passingCouplesCount: 2,
    groups: [group],
    roundScores: scores
  };

  expect(isDrawInRound(round)).toBe(false);
});

it('Returns false if no draw', () => {
  const leaderId1 = 'l1';
  const leaderId2 = 'l2';
  const followerId1 = 'f1';
  const followerId2 = 'f2';

  const scores: Array<Score> = [
    { participantId: leaderId1, score: 2 },
    { participantId: leaderId2, score: 1 },
    { participantId: followerId1, score: 2 },
    { participantId: followerId2, score: 1 }
  ];

  const pairs: Array<Pair> = [
    { leader: leaderId1, follower: followerId1 },
    { leader: leaderId2, follower: followerId2 }
  ];
  const group: DanceGroup = { id: 'group', dances: [], pairs };
  const round: Round = {
    ...createRound(),
    passingCouplesCount: 1,
    groups: [group],
    roundScores: scores
  };

  expect(isDrawInRound(round)).toBe(false);
});

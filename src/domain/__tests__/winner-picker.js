import { createRound } from '../../test-utils';
import WinnerPicker from '../winner-picker';

// @flow

describe('Winner picker', () => {
  const leaders = ['l1', 'l2'];
  const followers = ['f1', 'f2'];

  const judgeId = 'judge';
  const criterionId = 'crit';
  const danceId = 'dance';

  const notes: Array<JudgeNote> = [
    {
      judgeId,
      participantId: leaders[0],
      criterionId,
      danceId,
      value: 20
    },
    {
      judgeId,
      participantId: leaders[1],
      criterionId,
      danceId,
      value: 1
    },
    {
      judgeId,
      participantId: followers[0],
      criterionId,
      danceId,
      value: 22
    },
    {
      judgeId,
      participantId: followers[1],
      criterionId,
      danceId,
      value: 2
    }
  ];

  const round: Round = {
    ...createRound(),
    passingCouplesCount: 1,
    groups: [
      {
        id: 'group1',
        pairs: [
          { leader: leaders[0], follower: followers[0] },
          { leader: leaders[1], follower: followers[1] }
        ],
        dances: [{ id: danceId, finished: false, active: true }]
      }
    ]
  };

  test('Picks the top dancers', () => {
    const picker = new WinnerPicker(round);

    expect(picker.pickWinners(notes)).toEqual({
      leaders: [leaders[0]],
      followers: [followers[0]]
    });
  });

  test('Winners are ordered', () => {
    const picker = new WinnerPicker({ ...round, passingCouplesCount: 2 });

    expect(picker.pickWinners(notes)).toEqual({
      leaders: [leaders[0], leaders[1]],
      followers: [followers[0], followers[1]]
    });
  });

  test('May return less couples if not enough', () => {
    const picker = new WinnerPicker({ ...round, passingCouplesCount: 10 });

    expect(picker.pickWinners(notes)).toEqual({
      leaders: [leaders[0], leaders[1]],
      followers: [followers[0], followers[1]]
    });
  });
});

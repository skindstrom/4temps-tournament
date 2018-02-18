// @flow
import NextGroupGenerator from '../next-group-generator';
import { createTournament, createRound } from '../../test-utils';

describe('Next group generator', () => {
  const leaders: Array<Participant> = [
    {
      id: 'leader1',
      name: 'leader1',
      role: 'leader',
      attendanceId: 1,
      isAttending: true
    },
    {
      id: 'leader2',
      name: 'leader2',
      role: 'leader',
      attendanceId: 2,
      isAttending: true
    }
  ];
  const followers: Array<Participant> = [
    {
      id: 'follower1',
      name: 'follower1',
      role: 'follower',
      attendanceId: 3,
      isAttending: true
    },
    {
      id: 'follower2',
      name: 'follower2',
      role: 'follower',
      attendanceId: 3,
      isAttending: true
    }
  ];

  describe('Single round', () => {
    const round: Round = {
      ...createRound(),
      groups: [
        {
          id: 'group',
          pairs: [{ leader: leaders[0].id, follower: followers[0].id }],
          dances: [
            {
              id: 'dance1',
              active: true,
              finished: false
            }
          ]
        }
      ]
    };

    test('null if no more participants', () => {
      const tournament = {
        ...createTournament(),
        participants: [leaders[0], followers[0]],
        rounds: [round]
      };

      expect(
        new NextGroupGenerator(tournament, []).generateForRound(round.id)
      ).toBeNull();
    });

    test('Next group with remaining participants if more participants', () => {
      const tournament = {
        ...createTournament(),
        participants: [...leaders, ...followers],
        rounds: [round]
      };

      expect(
        new NextGroupGenerator(tournament, []).generateForRound(round.id)
      ).toMatchObject({
        pairs: [{ leader: leaders[1].id, follower: followers[1].id }],
        dances: [
          {
            active: false,
            finished: false
          }
        ]
      });
    });

    test('Picks previous participant if uneven', () => {
      const tournament = {
        ...createTournament(),
        participants: [...leaders, followers[0]],
        rounds: [round]
      };

      const danceId = 'dance1';
      const criterionId = 'crit1';
      const judgeId = 'judge1';
      const notes: Array<JudgeNote> = [
        {
          danceId,
          criterionId,
          participantId: leaders[0].id,
          judgeId,
          value: 5
        },
        {
          danceId,
          criterionId,
          participantId: followers[0].id,
          judgeId,
          value: 1
        }
      ];

      expect(
        new NextGroupGenerator(tournament, notes).generateForRound(round.id)
      ).toMatchObject({
        pairs: [{ leader: leaders[1].id, follower: followers[0].id }],
        dances: [
          {
            active: false,
            finished: false
          }
        ]
      });
    });

    test('Picks worst previous participant if uneven', () => {
      const round: Round = {
        ...createRound(),
        groups: [
          {
            id: 'group1',
            pairs: [{ leader: leaders[0].id, follower: followers[0].id }],
            dances: [
              {
                id: 'dance1',
                active: false,
                finished: false
              }
            ]
          },
          {
            id: 'group2',
            pairs: [{ leader: leaders[1].id, follower: followers[1].id }],
            dances: [
              {
                id: 'dance2',
                active: false,
                finished: false
              }
            ]
          }
        ]
      };

      const tournament: Tournament = {
        ...createTournament(),
        participants: [
          ...leaders,
          {
            name: 'leader3',
            id: 'leader3',
            role: 'leader',
            isAttending: true,
            attendanceId: 10
          },
          ...followers
        ],
        rounds: [round]
      };

      const danceId = 'dance1';
      const criterionId = 'crit1';
      const judgeId = 'judge1';
      const notes: Array<JudgeNote> = [
        {
          danceId,
          criterionId,
          participantId: leaders[0].id,
          judgeId,
          value: 10
        },
        {
          danceId,
          criterionId,
          participantId: followers[0].id, // follower with worst leader
          judgeId,
          value: 100
        },
        {
          danceId,
          criterionId,
          participantId: leaders[1].id,
          judgeId,
          value: 100
        },
        {
          danceId,
          criterionId,
          participantId: followers[1].id,
          judgeId,
          value: 10
        }
      ];

      expect(
        new NextGroupGenerator(tournament, notes).generateForRound(round.id)
      ).toMatchObject({
        pairs: [{ leader: 'leader3', follower: followers[0].id }],
        dances: [
          {
            active: false,
            finished: false
          }
        ]
      });
    });

    test('Handles the case when there are more than one uneven participants', () => {
      const round: Round = {
        ...createRound(),
        minPairCountPerGroup: 2,
        maxPairCountPerGroup: 2,
        groups: [
          {
            id: 'group1',
            pairs: [{ leader: leaders[0].id, follower: followers[0].id }],
            dances: [
              {
                id: 'dance1',
                active: false,
                finished: false
              }
            ]
          },
          {
            id: 'group2',
            pairs: [{ leader: leaders[1].id, follower: followers[1].id }],
            dances: [
              {
                id: 'dance2',
                active: false,
                finished: false
              }
            ]
          }
        ]
      };

      const tournament: Tournament = {
        ...createTournament(),
        participants: [
          ...leaders,
          {
            name: 'leader3',
            id: 'leader3',
            role: 'leader',
            isAttending: true,
            attendanceId: 10
          },
          {
            name: 'leader4',
            id: 'leader4',
            role: 'leader',
            isAttending: true,
            attendanceId: 11
          },
          ...followers
        ],
        rounds: [round]
      };

      const danceId = 'dance1';
      const criterionId = 'crit1';
      const judgeId = 'judge1';
      const notes: Array<JudgeNote> = [
        {
          danceId,
          criterionId,
          participantId: leaders[0].id,
          judgeId,
          value: 10
        },
        {
          danceId,
          criterionId,
          participantId: followers[0].id, // follower with worst leader
          judgeId,
          value: 100
        },
        {
          danceId,
          criterionId,
          participantId: leaders[1].id,
          judgeId,
          value: 100
        },
        {
          danceId,
          criterionId,
          participantId: followers[1].id,
          judgeId,
          value: 10
        }
      ];

      // $FlowFixMe
      const resultGroup: DanceGroup = new NextGroupGenerator(
        tournament,
        notes
      ).generateForRound(round.id);

      const resultingLeaders = resultGroup.pairs.map(({ leader }) => leader);
      const resultingFollowers = resultGroup.pairs.map(
        ({ follower }) => follower
      );

      expect(resultingLeaders).toContainEqual('leader3');
      expect(resultingLeaders).toContainEqual('leader4');
      expect(resultingFollowers).toContainEqual('follower1');
      expect(resultingFollowers).toContainEqual('follower2');
    });

    test('Returns null if even pairing can not be created, single participant', () => {
      const newRound = { ...round, groups: [] };
      const tournament: Tournament = {
        ...createTournament(),
        participants: [leaders[0]],
        rounds: [newRound]
      };

      expect(
        new NextGroupGenerator(tournament, []).generateForRound(newRound.id)
      ).toBeNull();
    });
  });
  describe('Two rounds', () => {
    const roundOne: Round = {
      ...createRound(),
      active: false,
      finished: true,
      winners: { leaders: [leaders[0].id], followers: [followers[0].id] },
      groups: [
        {
          id: 'group1',
          pairs: [
            { leader: leaders[0].id, follower: followers[0].id },
            { leader: leaders[1].id, follower: followers[1].id }
          ],
          dances: [
            {
              id: 'dance1',
              active: false,
              finished: true
            }
          ]
        }
      ]
    };

    const roundTwo: Round = {
      ...createRound(),
      active: true,
      finished: false,
      groups: []
    };

    test('Uses winners of previous round', () => {
      const tournament = {
        ...createTournament(),
        participants: [...leaders, ...followers],
        rounds: [roundOne, roundTwo]
      };

      expect(
        new NextGroupGenerator(tournament, []).generateForRound(roundTwo.id)
      ).toMatchObject({
        pairs: [{ leader: leaders[0].id, follower: followers[0].id }],
        dances: [
          {
            active: false,
            finished: false
          }
        ]
      });
    });
  });
});

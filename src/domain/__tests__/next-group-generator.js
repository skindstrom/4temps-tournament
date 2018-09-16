// @flow
import NextGroupGenerator from '../next-group-generator';
import {
  createTournament,
  createRound,
  createParticipant,
  createJudge
} from '../../test-utils';

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
      const judgeId = 'judge1';
      const tournament = {
        ...createTournament(),
        judges: [{ ...createJudge(), id: judgeId }],
        participants: [...leaders, followers[0]],
        rounds: [round]
      };

      const danceId = 'dance1';
      const criterionId = round.criteria[0].id;
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

      const judgeId = 'judge1';
      const tournament: Tournament = {
        ...createTournament(),
        judges: [{ ...createJudge(), id: judgeId }],
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
      const criterionId = round.criteria[0].id;
      const notes: Array<JudgeNote> = [
        {
          danceId,
          criterionId,
          participantId: leaders[0].id,
          judgeId,
          value: 1
        },
        {
          danceId,
          criterionId,
          participantId: followers[0].id, // follower with worst leader
          judgeId,
          value: 2
        },
        {
          danceId,
          criterionId,
          participantId: leaders[1].id,
          judgeId,
          value: 3
        },
        {
          danceId,
          criterionId,
          participantId: followers[1].id,
          judgeId,
          value: 4
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

      const judgeId = 'judge1';
      const tournament: Tournament = {
        ...createTournament(),
        judges: [{ ...createJudge(), id: judgeId }],
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
      const criterionId = round.criteria[0].id;
      const notes: Array<JudgeNote> = [
        {
          danceId,
          criterionId,
          participantId: leaders[0].id,
          judgeId,
          value: 1
        },
        {
          danceId,
          criterionId,
          participantId: followers[0].id, // follower with worst leader
          judgeId,
          value: 2
        },
        {
          danceId,
          criterionId,
          participantId: leaders[1].id,
          judgeId,
          value: 3
        },
        {
          danceId,
          criterionId,
          participantId: followers[1].id,
          judgeId,
          value: 4
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
      passingCouplesCount: 1,
      scores: [
        {
          participantId: leaders[0].id,
          score: 10
        },
        { participantId: followers[0].id, score: 5 },
        {
          participantId: leaders[1].id,
          score: 5
        },
        { participantId: followers[1].id, score: 3 }
      ],
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

    test('A participant may dance at most once more than any other', () => {
      const leaders: Array<Participant> = Array.from({ length: 2 }, (_, i) => ({
        ...createParticipant(),
        id: `L${i + 1}`,
        role: 'leader',
        isAttending: true
      }));
      const followers: Array<Participant> = Array.from(
        { length: 4 },
        (_, i) => ({
          ...createParticipant(),
          id: `F${i + 1}`,
          role: 'follower',
          isAttending: true
        })
      );

      // in this round, L1 has danced twice as it had the worst follower
      const round: Round = {
        ...createRound(),
        active: true,
        finished: false,
        minPairCountPerGroup: 1,
        maxPairCountPerGroup: 1,
        groups: [
          {
            id: 'group1',
            pairs: [{ leader: 'L1', follower: 'F1' }],
            dances: [
              {
                id: 'dance1',
                active: false,
                finished: true
              }
            ]
          },
          {
            id: 'group2',
            pairs: [{ leader: 'L2', follower: 'F2' }],
            dances: [
              {
                id: 'dance2',
                active: false,
                finished: true
              }
            ]
          },
          {
            id: 'group3',
            pairs: [{ leader: 'L1', follower: 'F3' }],
            dances: [
              {
                id: 'dance3',
                active: false,
                finished: true
              }
            ]
          }
        ]
      };

      const judgeId = 'judge1';
      const tournament: Tournament = {
        ...createTournament(),
        judges: [{ ...createJudge(), id: judgeId }],
        participants: [...leaders, ...followers],
        rounds: [round]
      };

      const criterionId = round.criteria[0].id;

      // L1 has worst follower twice in a row
      const notes: Array<JudgeNote> = [
        {
          danceId: 'dance1',
          criterionId,
          participantId: 'L1',
          judgeId,
          value: 50
        },
        {
          danceId: 'dance1',
          criterionId,
          participantId: 'F1',
          judgeId,
          value: 1
        },
        {
          danceId: 'dance2',
          criterionId,
          participantId: 'L2',
          judgeId,
          value: 10
        },
        {
          danceId: 'dance2',
          criterionId,
          participantId: 'F2',
          judgeId,
          value: 100
        },
        {
          danceId: 'dance3',
          criterionId,
          participantId: 'L1',
          judgeId,
          value: 50
        },
        {
          danceId: 'dance3',
          criterionId,
          participantId: 'F3',
          judgeId,
          value: 1
        }
      ];

      expect(
        new NextGroupGenerator(tournament, notes).generateForRound(round.id)
      ).toMatchObject({
        // L1 already danced twice, L2's turn
        pairs: [{ leader: 'L2', follower: 'F4' }]
      });
    });
  });
});

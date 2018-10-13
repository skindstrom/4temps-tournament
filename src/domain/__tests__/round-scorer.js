// @flow
import RoundScorer from '../round-scorer';
import {
  createParticipant,
  createJudge,
  generateId,
  createRound
} from '../../test-utils';

describe('Round scorer', () => {
  test('Generates correct score, best dance', () => {
    const participants = [createParticipant()];
    const judges = [createJudge()];
    const dances = [generateId(), generateId()];

    const round = {
      ...createRoundWithGroups(dances),
      danceScoringRule: 'best'
    };
    const criterionId = round.criteria[0].id;

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId,
        danceId: dances[0],
        value: 1
      },
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId,
        danceId: dances[1],
        value: 10
      }
    ];

    const scorer = new RoundScorer(judges, round);
    expect(scorer.scoreRound(notes)).toEqual([
      { participantId: participants[0].id, score: 10 }
    ]);
  });

  test('Generates correct score, average', () => {
    const participants = [createParticipant()];
    const judges = [createJudge()];
    const dances = [generateId(), generateId()];

    const round = {
      ...createRoundWithGroups(dances),
      danceScoringRule: 'average'
    };
    const criterionId = round.criteria[0].id;

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId,
        danceId: dances[0],
        value: 1
      },
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId,
        danceId: dances[1],
        value: 10
      }
    ];

    const scorer = new RoundScorer(judges, round);
    expect(scorer.scoreRound(notes)).toEqual([
      { participantId: participants[0].id, score: 5.5 }
    ]);
  });

  test('Generates 0-score if no notes', () => {
    const leader = { ...createParticipant(), role: 'leader' };
    const follower = { ...createParticipant(), role: 'follower' };

    const round: Round = {
      ...createRound(),
      groups: [
        {
          id: 'group1',
          pairs: [{ leader: leader.id, follower: follower.id }],
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

    const scorer = new RoundScorer([], round);
    const roundScores = scorer.scoreRound([]);
    expect(roundScores).toContainEqual({ participantId: leader.id, score: 0 });
    expect(roundScores).toContainEqual({
      participantId: follower.id,
      score: 0
    });
  });

  test('Selects random participant if equal score', () => {
    const judge = createJudge();
    const danceId = 'd1';

    const round: Round = {
      ...createRound(),
      groups: [
        {
          id: 'group1',
          pairs: [
            { leader: 'l1', follower: 'f1' },
            { leader: 'l2', follower: 'f2' }
          ],
          dances: [
            {
              id: danceId,
              active: false,
              finished: true
            }
          ]
        }
      ]
    };
    const criterionId = round.criteria[0].id;

    // leaders have same score, followers have same score
    const notes: Array<JudgeNote> = [
      {
        judgeId: judge.id,
        criterionId,
        danceId,
        participantId: 'l1',
        value: 3
      },
      {
        judgeId: judge.id,
        criterionId,
        danceId,
        participantId: 'l2',
        value: 3
      },
      {
        judgeId: judge.id,
        criterionId,
        danceId,
        participantId: 'f1',
        value: 1
      },
      {
        judgeId: judge.id,
        criterionId,
        danceId,
        participantId: 'f2',
        value: 1
      }
    ];

    const scorer = new RoundScorer([judge], round);
    const leaderWinners = new Set();
    const followerWinners = new Set();
    for (let i = 0; i < 200; ++i) {
      const roundScores = scorer.scoreRound(notes);
      // leaders have higher score, should have pos. 0 and 1
      leaderWinners.add(roundScores[0].participantId);
      // followers have lower score, should have pos. 2 and 3
      followerWinners.add(roundScores[2].participantId);
    }
    expect(leaderWinners).toContainEqual('l1');
    expect(leaderWinners).toContainEqual('l2');
    expect(followerWinners).toContainEqual('f1');
    expect(followerWinners).toContainEqual('f2');
  });

  test('Account for score by president judge if configured to do so', () => {
    const president = { ...createJudge(), judgeType: 'president' };
    const danceId = 'd1';

    const round: Round = {
      ...createRound(),
      groups: [
        {
          id: 'group1',
          pairs: [{ leader: 'l1', follower: 'f1' }],
          dances: [
            {
              id: danceId,
              active: false,
              finished: true
            }
          ]
        }
      ]
    };
    const criterionId = round.criteria[0].id;

    const notes: Array<JudgeNote> = [
      {
        judgeId: president.id,
        criterionId,
        danceId,
        participantId: 'l1',
        value: 3
      },
      {
        judgeId: president.id,
        criterionId,
        danceId,
        participantId: 'f1',
        value: 3
      }
    ];

    const scoresWithoutPresident = new RoundScorer(
      [president],
      round
    ).scoreRound(notes);
    expect(scoresWithoutPresident).toContainEqual({
      participantId: 'l1',
      score: 0
    });
    expect(scoresWithoutPresident).toContainEqual({
      participantId: 'f1',
      score: 0
    });

    const scoresWithPresident = new RoundScorer([president], round, {
      countPresident: true
    }).scoreRound(notes);
    expect(scoresWithPresident).toContainEqual({
      participantId: 'l1',
      score: 3
    });
    expect(scoresWithPresident).toContainEqual({
      participantId: 'f1',
      score: 3
    });
  });
});

function createRoundWithGroups(danceIds: Array<string>): Round {
  return {
    ...createRound(),
    groups: [
      {
        id: generateId(),
        pairs: [],
        dances: [
          {
            id: danceIds[0],
            active: false,
            finished: false
          },
          {
            id: danceIds[1],
            active: false,
            finished: false
          }
        ]
      },
      {
        id: generateId(),
        pairs: [],
        dances: [
          {
            id: danceIds[2],
            active: false,
            finished: false
          },
          {
            id: danceIds[3],
            active: false,
            finished: false
          }
        ]
      }
    ]
  };
}

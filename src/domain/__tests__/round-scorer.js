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
    const criterionIds = [generateId()];
    const dances = [generateId(), generateId()];

    const round = {
      ...createRoundWithGroups(dances),
      danceScoringRule: 'best'
    };

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[0],
        value: 1
      },
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[1],
        value: 10
      }
    ];

    const scorer = new RoundScorer(round);
    expect(scorer.scoreRound(notes)).toEqual([
      { participantId: participants[0].id, score: 10 }
    ]);
  });

  test('Generates correct score, average', () => {
    const participants = [createParticipant()];
    const judges = [createJudge()];
    const criterionIds = [generateId()];
    const dances = [generateId(), generateId()];

    const round = {
      ...createRoundWithGroups(dances),
      danceScoringRule: 'average'
    };

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[0],
        value: 1
      },
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[1],
        value: 10
      }
    ];

    const scorer = new RoundScorer(round);
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

    const scorer = new RoundScorer(round);
    const scores = scorer.scoreRound([]);
    expect(scores).toContainEqual({ participantId: leader.id, score: 0 });
    expect(scores).toContainEqual({ participantId: follower.id, score: 0 });
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

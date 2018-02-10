// @flow
import RoundScorer from '../round-scorer';
import {
  createParticipant, createJudge, generateId, createRound
} from '../../test-utils';

describe('Dance scorer', () => {
  test('Generates correct score', () => {
    const participants = [createParticipant(), createParticipant()];
    const judges = [createJudge(), createJudge()];
    const criterionIds = [generateId(), generateId()];
    const dances = [generateId(), generateId(), generateId(), generateId()];

    const round = createRoundWithGroups(dances);

    const notes: Array<JudgeNote> = [
      {
        judgeId: judges[0].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[0],
        value: 1
      },
      {
        judgeId: judges[1].id,
        participantId: participants[0].id,
        criterionId: criterionIds[0],
        danceId: dances[0],
        value: 2
      },
      {
        judgeId: judges[1].id,
        participantId: participants[0].id,
        criterionId: criterionIds[1],
        danceId: dances[1],
        value: 5
      },
      {
        judgeId: judges[0].id,
        participantId: participants[1].id,
        criterionId: criterionIds[0],
        danceId: dances[0],
        value: 2
      },
      {
        judgeId: judges[0].id,
        participantId: participants[1].id,
        criterionId: criterionIds[0],
        danceId: dances[1],
        value: 10
      },
      {
        judgeId: judges[0].id,
        participantId: participants[1].id,
        criterionId: criterionIds[1],
        danceId: dances[0],
        value: 20
      },
      {
        judgeId: judges[0].id,
        participantId: participants[1].id,
        criterionId: criterionIds[1],
        danceId: dances[1],
        value: 123
      },
    ];

    // participant0 => 1 + 2 + 5 = 8
    // participant1 => 2 + 10 + 20 + 123 = 32 + 123 = 155

    const scorer = new RoundScorer(participants, round);
    expect(scorer.scoreRound(notes))
      .toEqual([
        { participant: participants[1], score: 155 },
        { participant: participants[0], score: 8 },
      ]);
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
            finished: false,
          },
          {
            id: danceIds[1],
            active: false,
            finished: false,
          },
        ],
      },
      {
        id: generateId(),
        pairs: [],
        dances: [
          {
            id: danceIds[2],
            active: false,
            finished: false,
          },
          {
            id: danceIds[3],
            active: false,
            finished: false,
          },
        ],
      },
    ]
  };
}
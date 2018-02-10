// @flow
import DanceScorer from '../dance-scorer';
import { createParticipant, createJudge, generateId } from '../../test-utils';

describe('Dance scorer', () => {
  test('Generates correct score', () => {
    const participants = [createParticipant(), createParticipant()];
    const judges = [createJudge(), createJudge()];
    const criterionIds = [generateId(), generateId()];
    const dances = [generateId(), generateId()];

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
        danceId: dances[0],
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
        danceId: dances[0],
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
    // participant1 => 2 + 10 + 20 = 32

    const scorer = new DanceScorer(participants, notes);
    expect(scorer.scoreDance(dances[0]))
      .toEqual([
        { participant: participants[1], score: 32 },
        { participant: participants[0], score: 8 },
      ]);
  });
});
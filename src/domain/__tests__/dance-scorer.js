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
      }
    ];

    // participant0 => 1 + 2 + 5 = 8
    // participant1 => 2 + 10 + 20 = 32

    const scorer = new DanceScorer(notes);
    expect(scorer.scoreDance(dances[0])).toEqual([
      { participantId: participants[1].id, score: 32 },
      { participantId: participants[0].id, score: 8 }
    ]);
  });

  test('Selects random participant if equal score', () => {
    const participants = ['p1', 'p2'];
    const judgeId = 'j1';
    const criterionId = 'c1';
    const danceId = 'd1';

    const notes: Array<JudgeNote> = [
      {
        judgeId,
        criterionId,
        danceId,
        participantId: participants[0],
        value: 1
      },
      {
        judgeId,
        criterionId,
        danceId,
        participantId: participants[1],
        value: 1
      }
    ];

    const scorer = new DanceScorer(notes);
    const winners = new Set();
    for (let i = 0; i < 20; ++i) {
      winners.add(scorer.scoreDance(danceId)[0].participantId);
    }
    expect(winners).toContainEqual('p1');
    expect(winners).toContainEqual('p2');
  });
});

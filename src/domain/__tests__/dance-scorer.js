// @flow
import DanceScorer from '../dance-scorer';
import {
  createParticipant,
  createJudge,
  generateId,
  createCriterion
} from '../../test-utils';

describe('Dance scorer', () => {
  test('Generates correct score', () => {
    const participants = [createParticipant(), createParticipant()];
    const judges = [createJudge(), createJudge()];
    const criteria = [createCriterion(), createCriterion()];
    const criterionIds = [criteria[0].id, criteria[1].id];
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

    const scorer = new DanceScorer(judges, criteria, notes);
    expect(scorer.scoreDance(dances[0])).toEqual([
      { participantId: participants[1].id, score: 32 },
      { participantId: participants[0].id, score: 8 }
    ]);
  });

  test('Selects random participant if equal score', () => {
    const participants = ['p1', 'p2'];
    const judge = createJudge();
    const judgeId = judge.id;
    const criterion = createCriterion();
    const criterionId = criterion.id;
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

    const scorer = new DanceScorer([judge], [criterion], notes);
    const winners = new Set();
    for (let i = 0; i < 200; ++i) {
      winners.add(scorer.scoreDance(danceId)[0].participantId);
    }
    expect(winners).toContainEqual('p1');
    expect(winners).toContainEqual('p2');
  });

  test('Sanctioner malus is percentage of the max possible note value', () => {
    const maxValueCrit1 = 4;
    const maxValueCrit2 = 2;
    const positiveJudgeCount = 2;
    const malusPercentage = 10;

    const malus = Math.round(
      (maxValueCrit1 + maxValueCrit2) *
        positiveJudgeCount *
        (1 - (100 - malusPercentage) / 100)
    );

    const scoreValue = 2;
    const expectedScore = scoreValue * 4 - malus;

    const participant = createParticipant();
    const normalJudge1 = { ...createJudge(), type: 'normal' };
    const normalJudge2 = { ...createJudge(), type: 'normal' };
    const sanctioner = { ...createJudge(), type: 'sanctioner' };
    const danceId = 'danceId';

    const normalCriterion1 = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 4,
      forJudgeType: 'normal'
    };
    const normalCriterion2 = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 2,
      forJudgeType: 'normal'
    };

    const malusCriterion = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 100,
      forJudgeType: 'sanctioner'
    };

    // for the normal judges, set the value of 2 on each criteria
    const notes: Array<JudgeNote> = [normalJudge1, normalJudge2].reduce(
      (acc, { id: judgeId }) => [
        ...acc,
        ...[normalCriterion1, normalCriterion2].map(({ id: criterionId }) => ({
          judgeId,
          participantId: participant.id,
          criterionId,
          danceId,
          value: scoreValue
        }))
      ],
      []
    );

    notes.push({
      danceId,
      judgeId: sanctioner.id,
      criterionId: malusCriterion.id,
      participantId: participant.id,
      value: 10 // 10% of max value
    });

    const scorer = new DanceScorer(
      [normalJudge1, normalJudge2, sanctioner],
      [normalCriterion1, normalCriterion2, malusCriterion],
      notes
    );
    expect(scorer.scoreDance(danceId)).toEqual([
      { participantId: participant.id, score: expectedScore }
    ]);
  });

  test('Sanctioner can not cause negative score', () => {
    const participant = createParticipant();
    const normalJudge = { ...createJudge(), type: 'normal' };
    const sanctioner = { ...createJudge(), type: 'sanctioner' };
    const danceId = 'danceId';

    const normalCriterion = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 4,
      forJudgeType: 'normal'
    };

    const malusCriterion = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 100,
      forJudgeType: 'sanctioner'
    };

    const notes: Array<JudgeNote> = [
      {
        judgeId: normalJudge.id,
        participantId: participant.id,
        criterionId: normalCriterion.id,
        danceId,
        value: 2
      },
      {
        judgeId: sanctioner.id,
        participantId: participant.id,
        criterionId: malusCriterion.id,
        danceId,
        value: 100
      }
    ];
    const scorer = new DanceScorer(
      [normalJudge, sanctioner],
      [normalCriterion, malusCriterion],
      notes
    );
    expect(scorer.scoreDance(danceId)).toEqual([
      { participantId: participant.id, score: 0 }
    ]);
  });

  test('Sanctioner can cause negative score with configuration parameter', () => {
    const participant = createParticipant();
    const normalJudge = { ...createJudge(), type: 'normal' };
    const sanctioner = { ...createJudge(), type: 'sanctioner' };
    const danceId = 'danceId';

    const normalCriterion = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 4,
      forJudgeType: 'normal'
    };

    const malusCriterion = {
      ...createCriterion(),
      minValue: 0,
      maxValue: 100,
      forJudgeType: 'sanctioner'
    };

    const notes: Array<JudgeNote> = [
      {
        judgeId: normalJudge.id,
        participantId: participant.id,
        criterionId: normalCriterion.id,
        danceId,
        value: 2
      },
      {
        judgeId: sanctioner.id,
        participantId: participant.id,
        criterionId: malusCriterion.id,
        danceId,
        value: 100
      }
    ];
    const scorer = new DanceScorer(
      [normalJudge, sanctioner],
      [normalCriterion, malusCriterion],
      notes,
      { allowNegative: true }
    );
    expect(scorer.scoreDance(danceId)).toEqual([
      { participantId: participant.id, score: -2 }
    ]);
  });
});

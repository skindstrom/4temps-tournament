// @flow

import validateRound from '../validate-round';

function createRound(vals: mixed): Round {
  return {
    id: '',
    name: 'name',
    danceCount: 1,
    minPairCount: 1,
    maxPairCount: 1000,
    tieRule: 'random',
    roundScoringRule: 'average',
    multipleDanceScoringRule: 'average',
    criteria: [createCriterion()],
    groups: [],
    active: false,
    ...vals,
  };
}

function createCriterion(vals: mixed): RoundCriterion {
  return {
    name: 'style',
    description: 'How beautiful their style is...',
    minValue: 0,
    maxValue: 100,
    type: 'both',
    ...vals
  };
}

describe('Round validator', () => {
  test('Empty name is invalid', () => {
    expect(validateRound(createRound({ name: '' })))
      .toMatchObject({ isValidRound: false, isValidName: false });
  });
  test('null dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: null })))
      .toMatchObject({ isValidRound: false, isValidDanceCount: false });
  });
  test('Zero dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: 0 })))
      .toMatchObject({ isValidRound: false, isValidDanceCount: false });
  });
  test('Negative dance count is invalid', () => {
    expect(validateRound(createRound({ danceCount: -1 })))
      .toMatchObject({ isValidRound: false, isValidDanceCount: false });
  });
  test('Positive dance count is valid', () => {
    expect(validateRound(createRound({ danceCount: 1 })))
      .toMatchObject({ isValidRound: true, isValidDanceCount: true });
    expect(validateRound(createRound({ danceCount: 100 })))
      .toMatchObject({ isValidRound: true, isValidDanceCount: true });
  });

  test('null minPairCount is invalid', () => {
    expect(validateRound(createRound({ minPairCount: null })))
      .toMatchObject({ isValidRound: false, isValidMinPairCount: false });
  });
  test('Zero minPairCount is invalid', () => {
    expect(validateRound(createRound({ minPairCount: 0 })))
      .toMatchObject({ isValidRound: false, isValidMinPairCount: false });
  });
  test('Negative minPairCount is invalid', () => {
    expect(validateRound(createRound({ minPairCount: -1 })))
      .toMatchObject({ isValidRound: false, isValidMinPairCount: false });
  });
  test('Positive minPairCount is valid', () => {
    expect(validateRound(createRound({ minPairCount: 1 })))
      .toMatchObject({ isValidRound: true, isValidMinPairCount: true });
    expect(validateRound(createRound({ minPairCount: 123 })))
      .toMatchObject({ isValidRound: true, isValidMinPairCount: true });
  });

  test('null maxPairCount is invalid', () => {
    expect(validateRound(createRound({ maxPairCount: null })))
      .toMatchObject({ isValidRound: false, isValidMaxPairCount: false });
  });
  test('Zero maxPairCount is invalid', () => {
    expect(validateRound(createRound({ maxPairCount: 0 })))
      .toMatchObject({ isValidRound: false, isValidMaxPairCount: false });
  });
  test('Negative maxPairCount is invalid', () => {
    expect(validateRound(createRound({ maxPairCount: -1 })))
      .toMatchObject({ isValidRound: false, isValidMaxPairCount: false });
  });
  test('Positive maxPairCount is valid', () => {
    expect(validateRound(createRound({ maxPairCount: 1 })))
      .toMatchObject({ isValidRound: true, isValidMaxPairCount: true });
    expect(validateRound(createRound({ maxPairCount: 123 })))
      .toMatchObject({ isValidRound: true, isValidMaxPairCount: true });
  });

  test('Max pair count may be equal to min pair count', () => {
    expect(validateRound(createRound({ minPairCount: 1, maxPairCount: 1 })))
      .toMatchObject({ isValidRound: true });
  });
  test('Max pair count may not be less than min pair count', () => {
    expect(validateRound(createRound({ minPairCount: 2, maxPairCount: 1 })))
      .toMatchObject({
        isValidRound: false,
        isMaxPairGreaterOrEqualToMinPair: false
      });
  });

  test('Tie rule must be set', () => {
    expect(validateRound(createRound({ tieRule: 'none' })))
      .toMatchObject({ isValidRound: false, isValidTieRule: false });

    expect(validateRound(createRound({ tieRule: 'random' })))
      .toMatchObject({ isValidRound: true, isValidTieRule: true });

    expect(validateRound(createRound({ tieRule: 'all' })))
      .toMatchObject({ isValidRound: true, isValidTieRule: true });
  });
  test('Tie rule must have a valid value', () => {
    expect(validateRound(createRound({ tieRule: 'bogus_value' })))
      .toMatchObject({ isValidRound: false, isValidTieRule: false });
  });

  test('Round scoring rule must be set', () => {
    expect(validateRound(createRound({ roundScoringRule: 'none' })))
      .toMatchObject({ isValidRound: false, isValidRoundScoringRule: false });

    ['average', 'averageWithoutOutliers'].map(roundScoringRule => {
      expect(validateRound(createRound({ roundScoringRule })))
        .toMatchObject({ isValidRound: true, isValidRoundScoringRule: true });
    });
  });
  test('Round scoring rule must have a valid value', () => {
    expect(validateRound(createRound({ roundScoringRule: 'bogus_value' })))
      .toMatchObject({ isValidRound: false, isValidRoundScoringRule: false });
  });

  test('Multiple dances scoring rule may not be set if the dance count is 1',
    () => {
      ['none', 'average', 'best', 'worst'].map(multipleDanceScoringRule => {
        expect(validateRound(createRound({
          multipleDanceScoringRule,
          danceCount: 1
        })))
          .toMatchObject({
            isValidRound: true,
            isValidMultipleDanceScoringRule: true
          });
      });
    });

  test(
    'Multiple dances scoring rule must be set if dance count is higher than 1',
    () => {
      expect(validateRound(createRound({
        multipleDanceScoringRule: 'none',
        danceCount: 2
      })))
        .toMatchObject({
          isValidRound: false,
          isValidMultipleDanceScoringRule: false
        });

      ['average', 'best', 'worst'].map(multipleDanceScoringRule => {
        expect(validateRound(createRound({
          multipleDanceScoringRule,
          danceCount: 2
        })))
          .toMatchObject({
            isValidRound: true,
            isValidMultipleDanceScoringRule: true
          });
      });
    });

  test('Multiple dances scoring rule must have a valid value', () => {
    expect(validateRound(createRound({
      multipleDanceScoringRule: 'bogus_value',
    })))
      .toMatchObject({
        isValidRound: false,
        isValidMultipleDanceScoringRule: false
      });
  });

  test('Having no criteria is invalid', () => {
    expect(validateRound(createRound({ criteria: [] })))
      .toMatchObject({
        isValidRound: false,
        isValidAmountOfCriteria: false
      });
  });
  test('Having least one criteria is valid', () => {
    expect(validateRound(createRound({ criteria: [createCriterion()] })))
      .toMatchObject({
        isValidRound: true,
        isValidAmountOfCriteria: true
      });

    expect(validateRound(createRound({
      criteria: [
        createCriterion(),
        createCriterion(),
        createCriterion(),
        createCriterion()]
    })))
      .toMatchObject({
        isValidRound: true,
        isValidAmountOfCriteria: true
      });
  });

  test('A criterion may not have a empty name', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ name: '' })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidName: false
      }]
    });
  });

  test('A criterion may have a non-empty name', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ name: 'style' })]
    }))).toMatchObject({
      isValidRound: true,
      isValidCriteria: true,
      criteriaValidation: [{
        isValidCriterion: true,
        isValidName: true
      }]
    });
  });

  test('A criterion may not have a empty description', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ description: '' })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidDescription: false
      }]
    });
  });

  test('A criterion may have a non-empty description', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ description: 'They have to be beautiful' })]
    }))).toMatchObject({
      isValidRound: true,
      criteriaValidation: [{
        isValidDescription: true
      }]
    });
  });

  test('A criterion may not have a null minValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ minValue: null })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidMinValue: false
      }]
    });
  });

  test('A criterion may not have a negative minValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ minValue: -1 })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidMinValue: false
      }]
    });
  });

  test('A criterion may have a zero or larger minValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ minValue: 0 }), createCriterion({ minValue: 3 })]
    }))).toMatchObject({
      isValidRound: true,
    });
  });

  test('A criterion may not have a null maxValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ maxValue: null })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidMaxValue: false
      }]
    });
  });

  test('A criterion may not have a negative maxValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ maxValue: -1 })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidMaxValue: false
      }]
    });
  });

  test('A criterion may have a positive non-zero maxValue', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ maxValue: 3 })]
    }))).toMatchObject({
      isValidRound: true,
    });
  });

  test('A criterion may not have an equal min value and max value', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ minValue: 1, maxValue: 1 })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidValueCombination: false
      }]
    });
  });

  test('A criterion may not have "none" as type', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ type: 'none' })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidType: false
      }]
    });
  });

  test('A criterion may not have an arbitrary value as type', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ type: 'wutisthis' })]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [{
        isValidCriterion: false,
        isValidType: false
      }]
    });
  });

  test('A criterion may have one of the enum values as type', () => {
    expect(validateRound(createRound({
      criteria:
        [createCriterion({ type: 'both' }),
          createCriterion({ type: 'one' }),
          createCriterion({ type: 'leader' }),
          createCriterion({ type: 'follower' })]
    }))).toMatchObject({
      isValidRound: true,
    });
  });

  test('All criteria are validated and are ordered', () => {
    expect(validateRound(createRound({
      criteria:
        [
          createCriterion({ name: '' }),
          createCriterion({ minValue: null }),
          createCriterion({ maxValue: null }),
          createCriterion({ description: '' }),
          createCriterion({ type: 'none' }),
        ]
    }))).toMatchObject({
      isValidRound: false,
      isValidCriteria: false,
      criteriaValidation: [
        {
          isValidCriterion: false,
          isValidName: false
        },
        {
          isValidCriterion: false,
          isValidMinValue: false
        },
        {
          isValidCriterion: false,
          isValidMaxValue: false
        },
        {
          isValidCriterion: false,
          isValidDescription: false
        },
        {
          isValidCriterion: false,
          isValidType: false
        },
      ]
    });
  });
});

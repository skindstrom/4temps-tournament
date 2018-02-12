// @flow

function validateRound(round: Round): RoundValidationSummary {
  const {
    name,
    danceCount,
    minPairCountPerGroup,
    maxPairCountPerGroup,
    passingCouplesCount,
    tieRule,
    roundScoringRule,
    criteria
  } = round;

  const isValidName = name.length > 0;
  const isValidDanceCount = danceCount != null && danceCount >= 1;
  const isValidPassingCouplesCount =
    passingCouplesCount != null && passingCouplesCount >= 2;
  const isValidMinPairCount =
    minPairCountPerGroup != null && minPairCountPerGroup >= 1;
  const isValidMaxPairCount =
    maxPairCountPerGroup != null && maxPairCountPerGroup >= 1;

  const isMaxPairGreaterOrEqualToMinPair =
    minPairCountPerGroup == null ||
    maxPairCountPerGroup == null ||
    maxPairCountPerGroup >= minPairCountPerGroup;

  const isValidTieRule = tieRule === 'random' || tieRule === 'all';

  const isValidRoundScoringRule =
    roundScoringRule === 'average' ||
    roundScoringRule === 'averageWithoutOutliers';

  const isValidMultipleDanceScoringRule = validateMultipleDanceScoringRule(
    round
  );

  const isValidAmountOfCriteria = criteria.length > 0;

  const { isValidCriteria, criteriaValidation } = validateCriteria(criteria);

  return {
    isValidRound:
      isValidName &&
      isValidDanceCount &&
      isValidMinPairCount &&
      isValidMaxPairCount &&
      isValidPassingCouplesCount &&
      isMaxPairGreaterOrEqualToMinPair &&
      isValidTieRule &&
      isValidRoundScoringRule &&
      isValidMultipleDanceScoringRule &&
      isValidAmountOfCriteria &&
      isValidCriteria,
    isValidName,
    isValidDanceCount,
    isValidMinPairCount,
    isValidMaxPairCount,
    isValidPassingCouplesCount,
    isMaxPairGreaterOrEqualToMinPair,
    isValidTieRule,
    isValidRoundScoringRule,
    isValidMultipleDanceScoringRule,
    isValidAmountOfCriteria,
    isValidCriteria,
    criteriaValidation
  };
}

function validateMultipleDanceScoringRule({
  danceCount,
  multipleDanceScoringRule
}: Round) {
  const isValidRule =
    multipleDanceScoringRule === 'average' ||
    multipleDanceScoringRule === 'best' ||
    multipleDanceScoringRule === 'worst';

  const isValidEnum = isValidRule || multipleDanceScoringRule === 'none';
  danceCount = danceCount || 0;

  return isValidRule || (isValidEnum && danceCount <= 1);
}

function validateCriteria(criteria: Array<RoundCriterion>) {
  if (criteria.length === 0) {
    return { isValidCriteria: true, criteriaValidation: [] };
  }

  const criteriaValidation = criteria.map(validateCriterion);
  const isValidCriteria = criteriaValidation.reduce(
    (acc, cur) => acc && cur.isValidCriterion,
    true
  );

  return {
    isValidCriteria,
    criteriaValidation
  };
}

function validateCriterion({
  name,
  description,
  minValue,
  maxValue,
  type
}: RoundCriterion) {
  const isValidName = name.length > 0;
  const isValidMinValue = minValue != null;
  const isValidMaxValue = maxValue != null;

  const isValidValueCombination =
    maxValue != null && minValue != null ? maxValue > minValue : true;
  // it has to be at least on of these types
  const isValidType = ['both', 'one', 'follower', 'leader'].reduce(
    (acc, cur) => acc || cur === type,
    false
  );

  const isValidDescription = description.length > 0;

  return {
    isValidCriterion:
      isValidName &&
      isValidMinValue &&
      isValidMaxValue &&
      isValidValueCombination &&
      isValidType &&
      isValidDescription,
    isValidName,
    isValidMinValue,
    isValidMaxValue,
    isValidValueCombination,
    isValidType,
    isValidDescription
  };
}

export default validateRound;

// @flow
import { handle } from 'redux-pack';

function createRound(state: UiCreateRoundReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type, payload } = action;

  switch (type) {
  case 'CREATE_ROUND':
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        isLoading: true,
        createdSuccessfully: false
      }),
      success: () => ({ ...getInitialState(), createdSuccessfully: true }),
      failure: () => ({
        isLoading: false,
        createdSuccessfully: false,
        validation: payload
      })
    });
  default:
    return state;
  }
}

export function getInitialState(): UiCreateRoundReduxState {
  return {
    isLoading: false,
    createdSuccessfully: false,
    validation: {
      isValidName: true,
      isValidRound: true,
      isValidDanceCount: true,
      isValidMinPairCount: true,
      isValidMaxPairCount: true,
      isMaxPairGreaterOrEqualToMinPair: true,
      isValidTieRule: true,
      isValidRoundScoringRule: true,
      isValidMultipleDanceScoringRule: true,
      isValidAmountOfCriteria: true,
      isValidCriteria: true,
      criteriaValidation: [{
        isValidCriterion: true,
        isValidName: true,
        isValidMinValue: true,
        isValidMaxValue: true,
        isValidValueCombination: true,
        isValidType: true,
        isValidDescription: true
      }]
    }
  };
}

export default createRound;
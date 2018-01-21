// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../create-round';
import makePackAction from '../../test-utils';

describe('Create round UI reducer', () => {
  test('Undefined returns default state', () => {
    const state = getInitialState();

    [LIFECYCLE.START, LIFECYCLE.SUCCESS, LIFECYCLE.FAILURE]
      .map(lifecycle =>
        expect(
          reducer(undefined, makePackAction(lifecycle, 'INVALID_ACTION')))
          .toEqual(state));
  });

  test('Invalid action does not change state', () => {
    const state = getInitialState();

    [LIFECYCLE.START, LIFECYCLE.SUCCESS, LIFECYCLE.FAILURE]
      .map(lifecycle =>
        expect(
          reducer(state, makePackAction(lifecycle, 'INVALID_ACTION')))
          .toEqual(state));
  });

  test('CREATE_ROUND action start sets flags', () => {
    const initial = {
      ...getInitialState(),
      isLoading: false,
      createdSuccessfully: true,
    };
    const expected = {
      ...getInitialState(),
      isLoading: true,
      createdSuccessfully: false
    };

    expect(reducer(initial,
      makePackAction(LIFECYCLE.START, 'CREATE_ROUND')))
      .toEqual(expected);
  });

  test('CREATE_ROUND action success sets flags', () => {
    const initial = {
      ...getInitialState(),
      isLoading: true,
      createdSuccessfully: false,
    };
    const expected = {
      ...getInitialState(),
      isLoading: false,
      createdSuccessfully: true
    };

    expect(reducer(initial,
      makePackAction(LIFECYCLE.SUCCESS, 'CREATE_ROUND')))
      .toEqual(expected);
  });

  test('CREATE_ROUND action success resets validation', () => {
    const initial = {
      validation: {
        ...getInitialState().validation,
        isValidRound: false,
        isValidDanceCount: false
      },
      isLoading: true,
      createdSuccessfully: false,
    };
    const expected = {
      ...getInitialState(),
      isLoading: false,
      createdSuccessfully: true
    };

    expect(reducer(initial,
      makePackAction(LIFECYCLE.SUCCESS, 'CREATE_ROUND')))
      .toEqual(expected);
  });

  test('CREATE_ROUND action failure sets flags and validation', () => {
    const initial = {
      ...getInitialState(),
      isLoading: true,
      createdSuccessfully: false,
    };

    const payload: RoundValidationSummary =
      { ...initial.validation, isValidRound: false, isValidDanceCount: false };

    const expected = {
      ...getInitialState(),
      isLoading: false,
      createdSuccessfully: false,
      validation: payload
    };

    expect(reducer(initial,
      makePackAction(LIFECYCLE.FAILURE, 'CREATE_ROUND', payload)))
      .toEqual(expected);
  });
});
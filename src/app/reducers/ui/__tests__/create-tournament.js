// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../create-tournament';
import makePackAction from '../../test-utils';

describe('Create tournament UI reducer', () => {
  test('Default value is not loading and valid', () => {
    const state = {
      isLoading: false,
      validation: {
        isValidTournament: true,
        isValidName: true,
        isValidDate: true,
        isValidType: true
      }
    };

    expect(reducer(undefined, makePackAction(LIFECYCLE.START, 'INVALID')))
      .toEqual(state);
    expect(getInitialState()).toEqual(state);
  });

  test('Invalid action does not change state', () => {
    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.START, 'INVALID_ACTION')))
      .toEqual(getInitialState());
    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.SUCCESS, 'INVALID_ACTION')))
      .toEqual(getInitialState());
    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')))
      .toEqual(getInitialState());
  });

  test('CREATE_TOURNAMENT start sets isLoading to true', () => {
    const state = getInitialState();
    expect(
      reducer(state, makePackAction(LIFECYCLE.START, 'CREATE_TOURNAMENT')))
      .toEqual({
        ...state,
        isLoading: true
      });
  });

  test('CREATE_TOURNAMENT success resets state', () => {
    const state = {
      isLoading: true,
      validation: {
        isValidTournament: false,
        isValidName: true,
        isValidDate: false,
        isValidType: true
      }
    };

    expect(
      reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'CREATE_TOURNAMENT')))
      .toEqual(getInitialState());
  });

  test('CREATE_TOURNAMENT failure sets validation and stops loading', () => {
    const state = getInitialState();

    const payload: TournamentValidationSummary = {
      isValidTournament: false,
      isValidName: false,
      isValidDate: true,
      isValidType: false
    };

    expect(
      reducer(state,
        makePackAction(LIFECYCLE.FAILURE, 'CREATE_TOURNAMENT', payload)))
      .toEqual({
        isLoading: false,
        validation: payload
      });
  });
});
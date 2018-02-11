// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../edit-tournament';
import makePackAction from '../../test-utils';

describe('Edit tournament UI reducer', () => {
  test('Default value is no tournaments', () => {
    const defaults: UiEditTournamentsReduxState = {
      isValidName: true,
      isValidDate: true
    };

    expect(getInitialState()).toEqual(defaults);
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION'))
    ).toEqual(getInitialState());
  });

  test('Invalid action does not change state', () => {
    expect(
      reducer(
        getInitialState(),
        makePackAction(LIFECYCLE.START, 'INVALID_ACTION')
      )
    ).toEqual(getInitialState());
    expect(
      reducer(
        getInitialState(),
        makePackAction(LIFECYCLE.SUCCESS, 'INVALID_ACTION')
      )
    ).toEqual(getInitialState());
    expect(
      reducer(
        getInitialState(),
        makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')
      )
    ).toEqual(getInitialState());
  });

  test('EDIT_TOURNAMENT starts has no effect', () => {
    expect(
      reducer(
        getInitialState(),
        makePackAction(LIFECYCLE.START, 'EDIT_TOURNAMENT')
      )
    ).toEqual(getInitialState());
  });

  test('EDIT_TOURNAMENT success resets validation', () => {
    const state = {
      isValidName: false,
      isValidDate: true
    };

    expect(
      reducer(state, makePackAction(LIFECYCLE.SUCCESS, 'EDIT_TOURNAMENT'))
    ).toMatchObject({
      isValidName: true,
      isValidDate: true
    });
  });

  test('EDIT_TOURNAMENT failure sets validation', () => {
    const state = getInitialState();

    const payload: TournamentValidationSummary = {
      isValidTournament: false,
      isValidName: false,
      isValidDate: true,
      isValidType: false
    };

    expect(
      reducer(
        state,
        makePackAction(LIFECYCLE.FAILURE, 'EDIT_TOURNAMENT', payload)
      )
    ).toEqual({
      isValidName: payload.isValidName,
      isValidDate: payload.isValidDate
    });
  });
});

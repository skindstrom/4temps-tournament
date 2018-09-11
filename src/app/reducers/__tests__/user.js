// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../user';
import makePackAction from '../test-utils';

describe('User reducer', () => {
  const id = '123';
  const initialState = getInitialState();

  test('Default id is empty string', () => {
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.SUCCESS, 'INVALID_ACTION'))
    ).toEqual({ id: '', role: '', tournamentId: '' });
    expect(getInitialState()).toEqual({ id: '', role: '', tournamentId: '' });
  });

  test('Successful login sets id', () => {
    const payload = { userId: id, role: '' };

    expect(
      reducer(
        initialState,
        makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER', payload)
      )
    ).toEqual({ id, role: 'admin', tournamentId: '' });
  });

  test('Failed login sets userId to previous value', () => {
    expect(
      reducer(initialState, makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER'))
    ).toEqual(initialState);

    expect(
      reducer(
        { id, role: 'admin', tournamentId: '' },
        makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER')
      )
    ).toEqual({ id, role: 'admin', tournamentId: '' });
  });

  test('Successful logout sets id to empty string', () => {
    expect(
      reducer(
        { id, role: 'admin', tournamentId: '' },
        makePackAction(LIFECYCLE.SUCCESS, 'LOGOUT_USER')
      )
    ).toEqual({ id: '', role: '', tournamentId: '' });
  });

  test('Failed logout makes does not impact', () => {
    expect(
      reducer(
        { id, role: 'admin', tournamentId: '' },
        makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')
      )
    ).toEqual({ id, role: 'admin', tournamentId: '' });

    expect(
      reducer(
        { id, role: 'admin', tournamentId: '' },
        makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')
      )
    ).toEqual({ id, role: 'admin', tournamentId: '' });
  });
});

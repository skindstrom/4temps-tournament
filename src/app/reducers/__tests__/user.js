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
    ).toEqual({ id: '', role: '' });
    expect(getInitialState()).toEqual({ id: '', role: ''});
  });

  test('Successful login sets id', () => {
    const payload = { userId: id , role: ''};

    expect(
      reducer(
        initialState,
        makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER', payload)
      )
    ).toEqual({ id, role: 'admin' });
  });

  test('Failed login sets userId to previous value', () => {
    expect(
      reducer(initialState, makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER'))
    ).toEqual(initialState);

    expect(
      reducer({ id, role: 'admin' }, makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER'))
    ).toEqual({ id, role: 'admin' });
  });

  test('Successful logout sets id to empty string', () => {
    expect(
      reducer({ id, role: 'admin' }, makePackAction(LIFECYCLE.SUCCESS, 'LOGOUT_USER'))
    ).toEqual({ id: '', role: '' });
  });

  test('Failed logout makes does not impact', () => {
    expect(
      reducer({ id, role: 'admin' }, makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER'))
    ).toEqual({ id, role: 'admin' });

    expect(
      reducer({ id, role: 'admin' }, makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER'))
    ).toEqual({ id, role: 'admin' });
  });
});

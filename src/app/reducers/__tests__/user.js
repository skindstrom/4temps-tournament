// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../user';
import makePackAction from '../test-utils';

describe('User reducer', () => {
  const id = '123';
  const initialState = getInitialState();

  test('Default id is empty string', () => {
    expect(reducer(undefined,
      makePackAction(LIFECYCLE.SUCCESS, 'INVALID_ACTION'))).toEqual({id: ''});
    expect(getInitialState()).toEqual({id: ''});
  });

  test('Successful login sets id', () => {
    const payload = {userId: id};

    expect(reducer(initialState,
      makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER', payload)))
      .toEqual({id});
  });

  test('Failed login sets userId to previous value', () => {
    expect(reducer(initialState,
      makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER')))
      .toEqual({id: ''});

    expect(reducer({id},
      makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER')))
      .toEqual({id});
  });

  test('Successful logout sets id to empty string', () => {
    expect(reducer({id},
      makePackAction(LIFECYCLE.SUCCESS, 'LOGOUT_USER')))
      .toEqual({id: ''});
  });

  test('Failed logout makes does not impact impact', () => {
    expect(reducer({id},
      makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')))
      .toEqual({id});

    expect(reducer({id: ''},
      makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')))
      .toEqual({id: ''});
  });

});

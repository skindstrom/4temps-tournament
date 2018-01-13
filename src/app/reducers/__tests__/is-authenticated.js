// @flow

import { LIFECYCLE, KEY } from 'redux-pack';

import isAuthenticated from '../is-authenticated';

type Lifecycle = typeof LIFECYCLE;
type PackAction = {
  type: string,
  payload: mixed,
  meta: mixed
}

// From https://github.com/lelandrichardson/redux-pack
// this utility method will make an action that redux pack understands
function makePackAction(lifecycle: Lifecycle,
  { type, payload, meta = {} }: PackAction) {
  return {
    type,
    payload,
    meta: {
      ...meta,
      [KEY.LIFECYCLE]: lifecycle,
    },
  };
}

test('Default value is false', () => {
  expect(isAuthenticated(undefined)).toBe(false);
});

test('Successful login makes authenticated true', () => {
  expect(isAuthenticated(false,
    makePackAction(LIFECYCLE.SUCCESS, {
      type: 'LOGIN_USER', payload: null, meta: {}
    })))
    .toBe(true);
});

test('Failed login makes authenticated false', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.FAILURE, {
      type: 'LOGIN_USER', payload: null, meta: {}
    })))
    .toBe(false);
});

test('Successful logout makes authenticated false', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.SUCCESS, {
      type: 'LOGOUT_USER', payload: null, meta: {}
    })))
    .toBe(false);
});

test('Failed logout makes does not impact authentication status', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.FAILURE, {
      type: 'LOGOUT_USER', payload: null, meta: {}
    })))
    .toBe(true);

  expect(isAuthenticated(false,
    makePackAction(LIFECYCLE.FAILURE, {
      type: 'LOGOUT_USER', payload: null, meta: {}
    })))
    .toBe(false);
});
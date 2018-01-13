// @flow

import { LIFECYCLE } from 'redux-pack';

import isAuthenticated from '../is-authenticated';
import makePackAction from '../test-utils';

test('Default value is false', () => {
  expect(isAuthenticated(undefined,
    makePackAction(LIFECYCLE.SUCCESS, ''))).toBe(false);
});

test('Successful login makes authenticated true', () => {
  expect(isAuthenticated(false,
    makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER')))
    .toBe(true);
});

test('Failed login makes authenticated false', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER')))
    .toBe(false);
});

test('Successful logout makes authenticated false', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.SUCCESS, 'LOGOUT_USER')))
    .toBe(false);
});

test('Failed logout makes does not impact authentication status', () => {
  expect(isAuthenticated(true,
    makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')))
    .toBe(true);

  expect(isAuthenticated(false,
    makePackAction(LIFECYCLE.FAILURE, 'LOGOUT_USER')))
    .toBe(false);
});
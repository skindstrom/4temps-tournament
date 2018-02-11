// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../login';
import makePackAction from '../../test-utils';
import type { AdminLoginValidationSummary } from '../../../../validators/validate-admin-login';

test('Default value is that all fields are valid and not loading', () => {
  expect(reducer(undefined, makePackAction(LIFECYCLE.FAILURE, ''))).toEqual({
    isLoading: false,
    isValid: true,
    isValidEmail: true,
    isValidPassword: true,
    doesAdminExist: true
  });
});

test('When a login starts, isLoading is set to true', () => {
  expect(
    reducer(undefined, makePackAction(LIFECYCLE.START, 'LOGIN_USER'))
  ).toMatchObject({ isLoading: true });
});

test('Only LOGIN_USER affects the state', () => {
  expect(
    reducer(undefined, makePackAction(LIFECYCLE.START, 'SOMETHING_ELSE'))
  ).toMatchObject({ isLoading: false });
});

test('When a login is successful, isLoading is set to false', () => {
  const state = getInitialState();
  state.isLoading = true;

  expect(
    reducer(state, makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER'))
  ).toMatchObject({ isLoading: false });
});

test('When a login fails, isLoading is set to false', () => {
  const state = getInitialState();
  state.isLoading = true;

  expect(
    reducer(state, makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER'))
  ).toMatchObject({ isLoading: false });
});

test('When a login is successful, the validation parameters are set', () => {
  const payload: AdminLoginValidationSummary = {
    isValid: false,
    isValidEmail: false,
    isValidPassword: false,
    doesAdminExist: false
  };

  const state = {
    ...getInitialState(),
    isValid: true,
    isValidEmail: true,
    isValidPassword: true,
    doesAdminExist: true
  };

  expect(
    reducer(state, makePackAction(LIFECYCLE.SUCCESS, 'LOGIN_USER', payload))
  ).toMatchObject(payload);
});

test('When a login fails, the validation parameters are set', () => {
  const payload: AdminLoginValidationSummary = {
    isValid: false,
    isValidEmail: false,
    isValidPassword: false,
    doesAdminExist: false
  };

  const state = {
    ...getInitialState(),
    isValid: true,
    isValidEmail: true,
    isValidPassword: true,
    doesAdminExist: true
  };

  expect(
    reducer(state, makePackAction(LIFECYCLE.FAILURE, 'LOGIN_USER', payload))
  ).toMatchObject(payload);
});

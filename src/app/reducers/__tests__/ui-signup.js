// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../ui-signup';
import makePackAction from '../test-utils';


test('Default state is that everything is valid and not loading', () => {
  const state: UiSignUpReduxState = {
    isLoading: false,
    validation: {
      isValid: true,
      isEmailNotUsed: true,
      isValidFirstName: true,
      isValidLastName: true,
      isValidEmail: true,
      isValidPassword: true
    }
  };

  expect(getInitialState()).toEqual(state);
  expect(reducer(undefined, makePackAction(LIFECYCLE.START, '')))
    .toEqual(state);
});

test('SIGNUP action start results in isLoading to be true', () => {
  expect(reducer(undefined, makePackAction(LIFECYCLE.START, 'SIGNUP')))
    .toMatchObject({ isLoading: true });
});

test('SIGNUP action success results in isLoading to be false', () => {
  const state = { ...getInitialState(), isLoading: true };

  expect(reducer(state, makePackAction(LIFECYCLE.SUCCESS, 'SIGNUP')))
    .toMatchObject({ isLoading: false });
});

test('SIGNUP action failure results in isLoading to be false', () => {
  const state = { ...getInitialState(), isLoading: true };

  expect(reducer(state, makePackAction(LIFECYCLE.FAILURE, 'SIGNUP')))
    .toMatchObject({ isLoading: false });
});

test('SIGNUP action success results in initial state', () => {
  const state = {
    isLoading: true,
    validation: {
      isValid: false,
      isEmailNotUsed: false,
      isValidFirstName: false,
      isValidLastName: false,
      isValidEmail: true,
      isValidPassword: true
    }
  };

  expect(reducer(state, makePackAction(LIFECYCLE.SUCCESS, 'SIGNUP')))
    .toEqual(getInitialState());
});

test('SIGNUP action failure results sets validation', () => {
  const payload = {
    isValid: false,
    isEmailNotUsed: false,
    isValidFirstName: false,
    isValidLastName: false,
    isValidEmail: true,
    isValidPassword: true
  };

  expect(
    reducer(getInitialState(),
      makePackAction(LIFECYCLE.FAILURE, 'SIGNUP', payload)))
    .toMatchObject({ validation: payload });
});
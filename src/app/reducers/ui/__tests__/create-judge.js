// @flow

import {LIFECYCLE} from 'redux-pack';

import reducer, {getInitialState} from '../create-judge';
import makePackAction from '../../test-utils';

describe('Create judge UI reducer', () => {
  test('Default value is set', () => {
    expect(
      reducer(undefined,
        makePackAction(LIFECYCLE.START, 'INVALID')))
      .toEqual(getInitialState());
  });

  describe('CREATE_JUDGE', () => {
    test('start sets flags', () => {
      const initial = {
        ...getInitialState(),
        isLoading: false,
        createdSuccessfully: true
      };
      const expected = {
        ...getInitialState(),
        isLoading: true,
        createdSuccessfully: false
      };
      expect(
        reducer(initial,
          makePackAction(LIFECYCLE.START, 'CREATE_JUDGE')))
        .toEqual(expected);
    });

    test('success sets flags', () => {
      const initial = {
        ...getInitialState(),
        isValid: false,
        isLoading: true,
        createdSuccessfully: false
      };
      const expected = {
        ...getInitialState(),
        isValid: true,
        isLoading: false,
        createdSuccessfully: true
      };
      expect(
        reducer(initial,
          makePackAction(LIFECYCLE.SUCCESS, 'CREATE_JUDGE')))
        .toEqual(expected);
    });

    test('failure sets flags', () => {
      const initial = {
        ...getInitialState(),
        isValid: true,
        isLoading: true,
        createdSuccessfully: false
      };
      const expected = {
        ...getInitialState(),
        isValid: false,
        isLoading: false,
        createdSuccessfully: false
      };
      expect(
        reducer(initial,
          makePackAction(LIFECYCLE.FAILURE, 'CREATE_JUDGE')))
        .toEqual(expected);
    });
  });
});

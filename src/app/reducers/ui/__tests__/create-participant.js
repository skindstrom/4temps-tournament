// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../create-participant';
import makePackAction from '../../test-utils';

describe('Create participant UI reducer', () => {
  test('Default value is not loading and valid', () => {
    const state: UiCreateParticipantReduxState = {
      isLoading: false,
      createdSuccessfully: false,
      validation: {
        isValidParticipant: true,
        isValidName: true,
        isValidRole: true
      }
    };

    expect(reducer(undefined,
      makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')))
      .toEqual(state);
    expect(getInitialState())
      .toEqual(state);
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

  test('CREATE_PARTICIPANT start sets isLoading to true', () => {
    const state = getInitialState();

    expect(reducer(state,
      makePackAction(LIFECYCLE.START, 'CREATE_PARTICIPANT')))
      .toEqual({
        ...state,
        isLoading: true
      });
  });

  test('CREATE_PARTICIPANT success resets validation and sets flag', () => {
    const state = {
      ...getInitialState(),
      validation: {
        isValidParticipant: false,
        isValidName: true,
        isValidRole: false
      }
    };

    expect(reducer(state,
      makePackAction(LIFECYCLE.SUCCESS, 'CREATE_PARTICIPANT')))
      .toEqual({
        isLoading: false,
        createdSuccessfully: true,
        validation: getInitialState().validation
      });
  });

  test('CREATE_PARTICIPANT failure sets validation', () => {
    const payload = {
      isValidParticipant: false,
      isValidName: true,
      isValidRole: false
    };
    const state = getInitialState();
    expect(reducer(state,
      makePackAction(LIFECYCLE.FAILURE, 'CREATE_PARTICIPANT', payload)))
      .toEqual({
        ...state,
        createdSuccessfully: false,
        validation: payload
      });
  });
});
// @flow

import { LIFECYCLE } from 'redux-pack';
import moment from 'moment';

import reducer, { getInitialState } from '../tournaments';
import makePackAction from '../test-utils';
import type { Tournament } from '../../../models/tournament';

describe('Tournament reducer', () => {

  test('Default value is no tournaments', () => {
    const defaults: TournamentReduxState = {
      isLoading: false,
      isInvalidated: true,
      didLoadUserTournaments: false,

      forUser: [],
      allIds: [],
      byId: {},
    };

    expect(getInitialState()).toEqual(defaults);
    expect(reducer(undefined,
      makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')))
      .toEqual(getInitialState());
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

  test('GET_ALL_TOURNAMENTS start sets isLoading to true', () => {
    expect(
      reducer(getInitialState(),
        makePackAction(LIFECYCLE.START, 'GET_ALL_TOURNAMENTS')))
      .toEqual({ ...getInitialState(), isLoading: true });
  });

  test('GET_ALL_TOURNAMENTS success sets flags and tournaments', () => {
    const payload: Array<Tournament> = [
      {
        _id: '1', name: 't1', date: moment(), type: 'jj'
      },
      {
        _id: '2', name: 't2', date: moment(), type: 'classic'
      }
    ];

    const allIds = ['1', '2'];
    const byId = { '1': payload[0], '2': payload[1] };

    expect(
      reducer(getInitialState(),
        makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', payload)))
      .toEqual({
        ...getInitialState(),
        isLoading: false,
        isInvalidated: false,
        allIds,
        byId,
      });
  });

  test('GET_ALL_TOURNAMENTS failure sets isLoading to false and' +
    'isInvalidated to true', () => {
    expect(
      reducer(getInitialState(),
        makePackAction(LIFECYCLE.FAILURE, 'GET_ALL_TOURNAMENTS')))
      .toEqual({
        ...getInitialState(),
        isLoading: false,
        isInvalidated: false
      });
  });

  test('GET_USER_TOURNAMENTS start sets loading to true', () => {
    expect(
      reducer(getInitialState(),
        makePackAction(LIFECYCLE.START, 'GET_USER_TOURNAMENTS')))
      .toEqual({ ...getInitialState(), isLoading: true });
  });

  test('GET_USER_TOURNAMENTS success sets forUser and tournaments', () => {
    const payload: Array<Tournament> = [
      {
        _id: '1', name: 't1', date: moment(), type: 'jj'
      },
      {
        _id: '2', name: 't2', date: moment(), type: 'classic'
      }
    ];

    const allIds = ['1', '2'];
    const byId = { '1': payload[0], '2': payload[1] };
    const forUser = ['1', '2'];

    expect(
      reducer(getInitialState(),
        makePackAction(LIFECYCLE.SUCCESS, 'GET_USER_TOURNAMENTS', payload)))
      .toEqual({
        ...getInitialState(),
        didLoadUserTournaments: true,
        allIds,
        byId,
        forUser
      });
  });

  test('GET_USER_TOURNAMENTS success extends allIds and byId', () => {
    const prevState = {
      ...getInitialState(),
      allIds: ['3'],
      byId: {
        '3': {
          _id: '3', name: 't3', date: moment(), type: 'classic'
        }
      }
    };

    const payload: Array<Tournament> = [
      {
        _id: '1', name: 't1', date: moment(), type: 'jj'
      },
      {
        _id: '2', name: 't2', date: moment(), type: 'classic'
      }
    ];

    const allIds = [...prevState.allIds, '1', '2'];
    const byId = { ...prevState.byId, '1': payload[0], '2': payload[1] };
    const forUser = ['1', '2'];

    expect(
      reducer(prevState,
        makePackAction(LIFECYCLE.SUCCESS, 'GET_USER_TOURNAMENTS', payload)))
      .toEqual({
        ...getInitialState(),
        didLoadUserTournaments: true,
        allIds,
        byId,
        forUser
      });
  });

  test('GET_USER_TOURNAMENTS success does not cause duplicates', () => {
    const prevState = {
      ...getInitialState(),
      allIds: ['1'],
      byId: {
        '1': {
          _id: '1',
          name: 'ANOTHER NAME, SAME ID',
          date: moment(),
          type: 'classic'
        }
      }
    };

    const payload: Array<Tournament> = [
      {
        _id: '1', name: 't1', date: moment(), type: 'jj'
      },
      {
        _id: '2', name: 't2', date: moment(), type: 'classic'
      }
    ];

    const allIds = ['1', '2'];
    const byId = { '1': payload[0], '2': payload[1] };
    const forUser = ['1', '2'];

    expect(
      reducer(prevState,
        makePackAction(LIFECYCLE.SUCCESS, 'GET_USER_TOURNAMENTS', payload)))
      .toEqual({
        ...getInitialState(),
        didLoadUserTournaments: true,
        allIds,
        byId,
        forUser
      });
  });

  test('GET_USER_TOURNAMENTS failure sets isLoading to false', () => {
    expect(
      reducer({ ...getInitialState(), isLoading: true },
        makePackAction(LIFECYCLE.FAILURE, 'GET_USER_TOURNAMENTS')))
      .toEqual({
        ...getInitialState(),
        isLoading: false
      });
  });

  test('CREATE_TOURNAMENT success adds the new tournament', () => {
    const state = getInitialState();

    const payload: Tournament = {
      _id: '1',
      name: 't1',
      date: moment(),
      type: 'jj'
    };

    const allIds = ['1'];
    const forUser = allIds;
    const byId = { '1': payload };

    expect(
      reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'CREATE_TOURNAMENT', payload)))
      .toEqual({
        ...state,
        allIds,
        byId,
        forUser,
      });
  });

  test('EDIT_TOURNAMENT success sets the new tournament', () => {
    const tournament: Tournament = {
      _id: '1',
      name: 't1',
      date: moment(),
      type: 'jj'
    };

    const allIds = ['1'];
    const forUser = allIds;
    const byId = { '1': tournament };

    const state = {
      ...getInitialState(),
      allIds,
      forUser,
      byId
    };

    const payload = {
      ...tournament,
      name: 'new name'
    };

    expect(
      reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'EDIT_TOURNAMENT', payload)))
      .toEqual({
        ...state,
        byId: {
          '1': payload
        },
      });
  });

  test('LOGOUT_USER success resets forUser list', () => {
    const state = { ...getInitialState(), forUser: ['1', '2'] };

    expect(
      reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'LOGOUT_USER')))
      .toEqual(getInitialState());
  });
});
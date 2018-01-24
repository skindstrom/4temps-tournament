// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../rounds';
import makePackAction from '../test-utils';

describe('Rounds reducer', () => {
  test('Undefined state sets initial state', () => {
    expect(reducer(undefined,
      makePackAction(LIFECYCLE.start, 'INVALID_ACTION', )))
      .toEqual(getInitialState());
  });

  test('Invalid action does not change state', () => {
    const state = getInitialState();

    [LIFECYCLE.START, LIFECYCLE.SUCCESS, LIFECYCLE.FAILURE]
      .map(lifecycle =>
        expect(
          reducer(state, makePackAction(lifecycle, 'INVALID_ACTION')))
          .toEqual(state));
  });

  test('GET_ROUNDS action start sets isLoading', () => {
    const state = getInitialState();

    expect(reducer(state,
      makePackAction(LIFECYCLE.START, 'GET_ROUNDS')))
      .toEqual({ ...state, isLoading: true });
  });

  test('GET_ROUNDS action success sets isLoading to false', () => {
    const state = { ...getInitialState(), isLoading: true };

    const payload = { tournamentId: '', rounds: [] };
    expect(reducer(state,
      makePackAction(LIFECYCLE.SUCCESS, 'GET_ROUNDS', payload)))
      .toMatchObject({ ...state, isLoading: false });
  });

  test('GET_ROUNDS action success sets rounds', () => {
    const tournamentId = '123';
    const rounds = [roundWithId('1'), roundWithId('2'), roundWithId('3')];
    const payload = { tournamentId, rounds };

    const initialState = getInitialState();
    const expectedState = {
      isLoading: false,
      forTournament: {
        [tournamentId]: ['1', '2', '3']
      },
      byId: {
        '1': rounds[0],
        '2': rounds[1],
        '3': rounds[2],
      }
    };

    expect(reducer(initialState,
      makePackAction(LIFECYCLE.SUCCESS, 'GET_ROUNDS', payload)))
      .toEqual(expectedState);
  });

  test('GET_ROUNDS failure sets isLoading to false', () => {
    const state = { ...getInitialState(), isLoading: true };

    expect(reducer(state,
      makePackAction(LIFECYCLE.FAILURE, 'GET_ROUNDS')))
      .toMatchObject({ ...state, isLoading: false });
  });

  test('CREATE_ROUND success sets the new round', () => {
    const tournamentId = '123';
    const payload = { round: roundWithId('3'), tournamentId };

    const expectedState = {
      ...getInitialState(),
      forTournament: {
        [tournamentId]: [payload.round._id]
      },
      byId: {
        [payload.round._id]: payload.round
      }
    };

    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.SUCCESS, 'CREATE_ROUND', payload)))
      .toMatchObject(expectedState);
  });

  test('UPDATE_ROUNDS action start sets isLoading to true', () => {
    expect(
      reducer(
        getInitialState(), makePackAction(LIFECYCLE.START, 'UPDATE_ROUNDS')))
      .toMatchObject({...getInitialState(), isLoading: true});
  });

  test('UPDATE_ROUNDS action success sets the new rounds', () => {
    const tournamentId = '123';
    const roundId = '3';
    const payload = { rounds: [roundWithId(roundId)], tournamentId };

    const expectedState = {
      ...getInitialState(),
      forTournament: {
        [tournamentId]: [roundId]
      },
      byId: {
        [roundId]: payload.rounds[0]
      }
    };

    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.SUCCESS, 'UPDATE_ROUNDS', payload)))
      .toMatchObject(expectedState);
  });

  test('UPDATE_ROUNDS action failure sets isLoading to false', () => {
    expect(
      reducer(
        getInitialState(), makePackAction(LIFECYCLE.FAILURE, 'UPDATE_ROUNDS')))
      .toMatchObject({...getInitialState(), isLoading: false});
  });
});

function roundWithId(id) {
  return {
    _id: id,
    danceCount: 1,
    minPairCount: 1,
    maxPairCount: 2,
    tieRule: 'random',
    roundScoringRule: 'average',
    multipleDanceScoringRule: 'worst',
    criteria: [{
      name: 'style',
      minValue: 1,
      maxValue: 2,
      description: 'style...',
      type: 'one'
    }]
  };
}

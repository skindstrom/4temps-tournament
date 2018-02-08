// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../rounds';
import { createTournament, createRound, generateId } from '../../../test-utils';
import makePackAction from '../test-utils';
import { normalizeTournamentArray } from '../normalize';

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

  describe('CREATE_ROUND', () => {
    test('success sets the new round', () => {
      const tournamentId = '123';
      const payload = { round: roundWithId('3'), tournamentId };

      const expectedState = {
        ...getInitialState(),
        forTournament: {
          [tournamentId]: [payload.round.id]
        },
        byId: {
          [payload.round.id]: payload.round
        }
      };

      expect(reducer(getInitialState(),
        makePackAction(LIFECYCLE.SUCCESS, 'CREATE_ROUND', payload)))
        .toMatchObject(expectedState);
    });
  });

  describe('DELETE_ROUND', () => {
    test('start sets isLoading to true', () => {
      expect(
        reducer(
          getInitialState(), makePackAction(LIFECYCLE.START, 'DELETE_ROUND')))
        .toMatchObject({...getInitialState(), isLoading: true});
    });

    test('success removes the round', () => {
      const tournamentId = '123';
      const roundId = '3';
      const round = roundWithId(roundId);

      const payload = {tournamentId, roundId};

      const initialState: RoundsReduxState = {
        ...getInitialState(),
        forTournament: {
          [tournamentId]: [roundId]
        },
        byId: {
          [roundId]: round
        }
      };

      const expected = getInitialState();

      expect(reducer(initialState,
        makePackAction(LIFECYCLE.SUCCESS, 'DELETE_ROUND', payload)))
        .toMatchObject(expected);
    });

    test('failure sets isLoading to false', () => {
      expect(
        reducer(
          getInitialState(), makePackAction(LIFECYCLE.FAILURE, 'DELETE_ROUND')))
        .toMatchObject({...getInitialState(), isLoading: false});
    });
  });

  describe('Get tournaments', () => {
    const rounds1 = [roundWithId('r1'), roundWithId('r2')];
    const rounds2 = [roundWithId('r3'), roundWithId('r4')];
    const tournament1 = {
      ...createTournament(),
      id: 't1',
      rounds: rounds1
    };
    const tournament2 = {
      ...createTournament(),
      id: 't2',
      rounds: rounds2
    };

    const norm = normalizeTournamentArray([tournament1, tournament2]);

    const expected = {
      ...getInitialState(),
      forTournament: {
        [tournament1.id]: [rounds1[0].id, rounds1[1].id],
        [tournament2.id]: [rounds2[0].id, rounds2[1].id],
      },
      byId: {
        [rounds1[0].id]: rounds1[0],
        [rounds1[1].id]: rounds1[1],
        [rounds2[0].id]: rounds2[0],
        [rounds2[1].id]: rounds2[1],
      }
    };

    test('GET_ALL_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', norm)
        ))
        .toEqual(expected);
    });
    test('GET_ADMIN_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ADMIN_TOURNAMENTS', norm)
        ))
        .toEqual(expected);
    });
  });

  describe('START_ROUND', () => {
    test('success updates round from payload', () => {
      const initialRound = createRound();
      const updatedRound: Round = {
        ...initialRound,
        groups: [{
          id: generateId(),
          pairs: [{ follower: generateId(), leader: generateId() }],
          dances: []
        }]
      };
      const tournamentId = generateId();

      const payload = updatedRound;

      const initial = {
        ...getInitialState(),
        forTournament: {
          [tournamentId]: [initialRound.id]
        },
        byId: {
          [initialRound.id]: initialRound
        }
      };

      const expected = {
        ...initial,
        byId: {
          [updatedRound.id]: updatedRound
        }
      };


      expect(
        reducer(initial,
          makePackAction(LIFECYCLE.SUCCESS, 'START_ROUND', payload))
      ).toEqual(expected);
    });
  });
});

function roundWithId(id: string): Round {
  return {
    id: id,
    name: 'name',
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
    }],
    groups: [],
    active: false,
    finished: false,
  };
}

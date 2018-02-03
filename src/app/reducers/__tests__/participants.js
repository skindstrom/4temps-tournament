// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../participants';
import makePackAction from '../test-utils';
import {createParticipant, createTournament} from '../../../test-utils';

describe('Participant reducer', () => {
  const initialState = getInitialState();

  test('Default value are no participants', () => {
    const state: ParticipantsReduxState = {
      isLoading: false,
      forTournament: {},
      byId: {},
    };

    expect(reducer(undefined,
      makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')))
      .toEqual(state);
    expect(getInitialState())
      .toEqual(state);
  });

  test('Invalid action does not change state', () => {
    expect(reducer(initialState,
      makePackAction(LIFECYCLE.START, 'INVALID_ACTION')))
      .toEqual(initialState);
    expect(reducer(initialState,
      makePackAction(LIFECYCLE.SUCCESS, 'INVALID_ACTION')))
      .toEqual(initialState);
    expect(reducer(initialState,
      makePackAction(LIFECYCLE.FAILURE, 'INVALID_ACTION')))
      .toEqual(initialState);
  });

  describe('CREATE_PARTICIPANT', () => {
    test('CREATE_PARTICIPANT success sets the new participant', () => {
      const participant = { ...createParticipant(), id: '1'};

      const tournamentId = 'tournamentid';
      const forTournament = { [tournamentId]: ['1'] };
      const byId = { '1': participant};

      const payload = { tournamentId, participant };

      const state = initialState;
      expect(reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'CREATE_PARTICIPANT', payload)))
        .toEqual({
          ...state,
          forTournament,
          byId,
        });
    });

    test('CREATE_PARTICIPANT success does not overwrite participants', () => {
      const tournamentId = 'tournamentid';

      const state = {
        ...initialState,
        forTournament: {
          [tournamentId]: ['p2id'],
          'other_tournamentid': ['p3id'],
        },
        byId: {
          'p2id': { ...createParticipant(), id: 'p2id'},
          'p3id': { ...createParticipant(), id: 'p3id'}
        }
      };

      const participant = { ...createParticipant(), id: 'new'};

      const forTournament = {
        ...state.forTournament,
        [tournamentId]: ['p2id', 'new']
      };
      const byId = { ...state.byId, 'new': participant};
      const payload = { tournamentId, participant };

      expect(reducer(state,
        makePackAction(LIFECYCLE.SUCCESS, 'CREATE_PARTICIPANT', payload)))
        .toEqual({
          ...state,
          forTournament,
          byId,
        });
    });


  });

  describe('CREATE_TOURNAMENT', () => {
    test('success sets empty participants', () => {
      const tournament = createTournament();

      expect(
        reducer(
          initialState, makePackAction(
            LIFECYCLE.SUCCESS, 'CREATE_TOURNAMENT', tournament)))
        .toEqual({
          ...initialState,
          forTournament: {
            [tournament.id]: []
          },
          byId: {}
        });
    });
  });

  describe('GET_ALL_TOURNAMENTS', () => {
    test('success sets participants', () => {
      const participants1 = [createParticipant(), createParticipant()];
      const participants2 = [createParticipant(), createParticipant()];
      const tournament1 = {
        ...createTournament(),
        id: 't1',
        participants: participants1
      };
      const tournament2 = {
        ...createTournament(),
        id: 't2',
        participants: participants2
      };

      const payload = [tournament1, tournament2];

      const expected = {
        ...initialState,
        forTournament: {
          [tournament1.id]: [participants1[0].id, participants1[1].id],
          [tournament2.id]: [participants2[0].id, participants2[1].id],
        },
        byId: {
          [participants1[0].id]: participants1[0],
          [participants1[1].id]: participants1[1],
          [participants2[0].id]: participants2[0],
          [participants2[1].id]: participants2[1],
        }
      };

      expect(
        reducer(
          initialState,
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', payload)
        ))
        .toEqual(expected);
    });
  });

  describe('GET_USER_TOURNAMENTS', () => {
    test('success sets participants', () => {
      const participants1 = [createParticipant(), createParticipant()];
      const participants2 = [createParticipant(), createParticipant()];
      const tournament1 = {
        ...createTournament(),
        id: 't1',
        participants: participants1
      };
      const tournament2 = {
        ...createTournament(),
        id: 't2',
        participants: participants2
      };

      const payload = [tournament1, tournament2];

      const expected = {
        ...initialState,
        forTournament: {
          [tournament1.id]: [participants1[0].id, participants1[1].id],
          [tournament2.id]: [participants2[0].id, participants2[1].id],
        },
        byId: {
          [participants1[0].id]: participants1[0],
          [participants1[1].id]: participants1[1],
          [participants2[0].id]: participants2[0],
          [participants2[1].id]: participants2[1],
        }
      };

      expect(
        reducer(
          initialState,
          makePackAction(LIFECYCLE.SUCCESS, 'GET_USER_TOURNAMENTS', payload)
        ))
        .toEqual(expected);
    });
  });
});

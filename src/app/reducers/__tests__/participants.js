// @flow

import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../participants';
import makePackAction from '../test-utils';
import type { Participant } from '../../../models/participant';

describe('Participant reducer', () => {
  test('Default value are no participants', () => {
    const state: ParticipantReduxState = {
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

  test('GET_PARTICIPANTS start sets isLoading to true', () => {
    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.START, 'GET_PARTICIPANTS')))
      .toEqual({ ...getInitialState(), isLoading: true });
  });

  test('GET_PARTICIPANTS success sets participants', () => {
    const participants: Array<Participant> = [
      { _id: '1', name: 'p1', role: 'leader' },
      { _id: '2', name: 'p2', role: 'follower' }
    ];

    const tournamentId = 'tournament_id';
    const forTournament = { [tournamentId]: ['1', '2'] };
    const byId = { '1': participants[0], '2': participants[1] };

    const payload = { tournamentId, participants };

    expect(reducer(getInitialState(),
      makePackAction(LIFECYCLE.SUCCESS, 'GET_PARTICIPANTS', payload)))
      .toEqual({
        ...getInitialState(),
        isLoading: false,
        forTournament,
        byId
      });
  });

  test('GET_PARTICIPANTS success does not overwrite other participants', () => {
    const state = {
      ...getInitialState(),
      forTournament: {
        'other_tournament_id': ['p3_id']
      },
      byId: {
        'p3_id': { _id: 'p3_id', name: 'p3', role: 'leader' }
      }
    };

    const participants: Array<Participant> = [
      { _id: '1', name: 'p1', role: 'leader' },
      { _id: '2', name: 'p2', role: 'follower' }
    ];

    const tournamentId = 'tournament_id';
    const forTournament = {
      ...state.forTournament,
      [tournamentId]: ['1', '2']
    };
    const byId = { ...state.byId, '1': participants[0], '2': participants[1] };

    const payload = { tournamentId, participants };

    expect(reducer(state,
      makePackAction(LIFECYCLE.SUCCESS, 'GET_PARTICIPANTS', payload)))
      .toEqual({
        ...getInitialState(),
        isLoading: false,
        forTournament,
        byId
      });
  });

  test('GET_PARTICIPANTS failure sets isLoading to false', () => {
    const state = { ...getInitialState(), isLoading: true };

    expect(reducer(state,
      makePackAction(LIFECYCLE.FAILURE, 'GET_PARTICIPANTS')))
      .toEqual({
        ...state,
        isLoading: false,
      });
  });

  test('CREATE_PARTICIPANT success sets the new participant', () => {
    const participant = { _id: '1', name: 'p1', role: 'leader' };

    const tournamentId = 'tournament_id';
    const forTournament = { [tournamentId]: ['1'] };
    const byId = { '1': participant};

    const payload = { tournamentId, participant };

    const state = getInitialState();
    expect(reducer(state,
      makePackAction(LIFECYCLE.SUCCESS, 'CREATE_PARTICIPANT', payload)))
      .toEqual({
        ...state,
        forTournament,
        byId,
      });
  });

  test('CREATE_PARTICIPANT success does not overwrite participants', () => {
    const tournamentId = 'tournament_id';

    const state = {
      ...getInitialState(),
      forTournament: {
        [tournamentId]: ['p2_id'],
        'other_tournament_id': ['p3_id'],
      },
      byId: {
        'p2_id': { _id: 'p2_id', name: 'p2', role: 'follower' },
        'p3_id': { _id: 'p3_id', name: 'p3', role: 'leader' }
      }
    };

    const participant = { _id: 'new', name: 'p1', role: 'leader' };

    const forTournament = {
      ...state.forTournament,
      [tournamentId]: ['p2_id', 'new']
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
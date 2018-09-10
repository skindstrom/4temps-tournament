// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../assistants';
import makePackAction from '../test-utils';
import {
  createTournament,
  createAssistant,
  generateId
} from '../../../test-utils';
import { normalizeTournamentArray } from '../normalize';

describe('Assistants reducer', () => {
  test('Undefined results in initial', () => {
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.SUCCESS, 'INVALID'))
    ).toEqual(getInitialState());
  });

  describe('Get tournaments', () => {
    const assistants1 = [createAssistant(), createAssistant()];
    const assistants2 = [createAssistant(), createAssistant()];
    const tournament1 = {
      ...createTournament(),
      id: 't1',
      assistants: assistants1
    };
    const tournament2 = {
      ...createTournament(),
      id: 't2',
      assistants: assistants2
    };

    const tournaments = [tournament1, tournament2];
    const nom = normalizeTournamentArray(tournaments);

    const expected = {
      ...getInitialState(),
      forTournament: {
        [tournament1.id]: [assistants1[0].id, assistants1[1].id],
        [tournament2.id]: [assistants2[0].id, assistants2[1].id]
      },
      byId: {
        [assistants1[0].id]: assistants1[0],
        [assistants1[1].id]: assistants1[1],
        [assistants2[0].id]: assistants2[0],
        [assistants2[1].id]: assistants2[1]
      }
    };

    test('GET_ALL_TOURNAMENTS success sets assistants', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', nom)
        )
      ).toEqual(expected);
    });
    test('GET_ADMIN_TOURNAMENTS success sets assistants', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ADMIN_TOURNAMENTS', nom)
        )
      ).toEqual(expected);
    });
  });

  describe('CREATE_ASSISTANT', () => {
    test('success adds the assistant', () => {
      const assistant = createAssistant();
      const tournamentId = generateId();
      const expected = {
        ...getInitialState(),
        byId: {
          [assistant.id]: assistant
        },
        forTournament: {
          [tournamentId]: [assistant.id]
        }
      };

      const payload = { tournamentId, assistant };
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'CREATE_ASSISTANT', payload)
        )
      ).toEqual(expected);
    });
  });
});

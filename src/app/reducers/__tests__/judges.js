// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../judges';
import makePackAction from '../test-utils';
import { createTournament, createJudge, generateId } from '../../../test-utils';
import { normalizeTournamentArray } from '../normalize';

describe('Judges reducer', () => {
  test('Undefined results in initial', () => {
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.SUCCESS, 'INVALID'))
    ).toEqual(getInitialState());
  });

  describe('Get tournaments', () => {
    const judges1 = [createJudge(), createJudge()];
    const judges2 = [createJudge(), createJudge()];
    const tournament1 = {
      ...createTournament(),
      id: 't1',
      judges: judges1
    };
    const tournament2 = {
      ...createTournament(),
      id: 't2',
      judges: judges2
    };

    const tournaments = [tournament1, tournament2];
    const nom = normalizeTournamentArray(tournaments);

    const expected = {
      ...getInitialState(),
      forTournament: {
        [tournament1.id]: [judges1[0].id, judges1[1].id],
        [tournament2.id]: [judges2[0].id, judges2[1].id]
      },
      byId: {
        [judges1[0].id]: judges1[0],
        [judges1[1].id]: judges1[1],
        [judges2[0].id]: judges2[0],
        [judges2[1].id]: judges2[1]
      }
    };

    test('GET_ALL_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', nom)
        )
      ).toEqual(expected);
    });
    test('GET_ADMIN_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ADMIN_TOURNAMENTS', nom)
        )
      ).toEqual(expected);
    });
  });

  describe('CREATE_JUDGE', () => {
    test('success adds the judge', () => {
      const judge = createJudge();
      const tournamentId = generateId();
      const expected = {
        ...getInitialState(),
        byId: {
          [judge.id]: judge
        },
        forTournament: {
          [tournamentId]: [judge.id]
        }
      };

      const payload = { tournamentId, judge };
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'CREATE_JUDGE', payload)
        )
      ).toEqual(expected);
    });
  });
});

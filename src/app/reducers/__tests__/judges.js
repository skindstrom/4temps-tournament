// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../judges';
import makePackAction from '../test-utils';
import {
  createTournament, createJudge, generateId
} from '../../../test-utils';

describe('Judges reducer', () => {
  test('Undefined results in initial', () => {
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.SUCCESS, 'INVALID')))
      .toEqual(getInitialState());
  });

  describe('Get tournaments', () => {
    const judges1 = [createJudge(), createJudge()];
    const judges2 = [createJudge(), createJudge()];
    const tournament1 = {
      ...createTournament(),
      _id: 't1',
      judges: judges1
    };
    const tournament2 = {
      ...createTournament(),
      _id: 't2',
      judges: judges2
    };

    const payload = [tournament1, tournament2];

    const expected = {
      ...getInitialState(),
      forTournament: {
        [tournament1._id]: [judges1[0]._id, judges1[1]._id],
        [tournament2._id]: [judges2[0]._id, judges2[1]._id],
      },
      byId: {
        [judges1[0]._id]: judges1[0],
        [judges1[1]._id]: judges1[1],
        [judges2[0]._id]: judges2[0],
        [judges2[1]._id]: judges2[1],
      }
    };

    test('GET_ALL_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_ALL_TOURNAMENTS', payload)
        ))
        .toEqual(expected);
    });
    test('GET_USER_TOURNAMENTS success sets rounds', () => {
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'GET_USER_TOURNAMENTS', payload)
        ))
        .toEqual(expected);
    });
  });

  describe('CREATE_JUDGE', () => {
    test('success adds the judge', () => {
      const judge = createJudge();
      const tournamentId = generateId();
      const expected = {
        ...getInitialState(),
        byId: {
          [judge._id]: judge
        },
        forTournament: {
          [tournamentId]: [judge._id]
        }
      };

      const payload = {tournamentId, judge};
      expect(
        reducer(
          getInitialState(),
          makePackAction(LIFECYCLE.SUCCESS, 'CREATE_JUDGE', payload)
        ))
        .toEqual(expected);
    });
  });
});

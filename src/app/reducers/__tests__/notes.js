// @flow
import { LIFECYCLE } from 'redux-pack';

import reducer, { getInitialState } from '../notes';
import makePackAction from '../test-utils';

describe('Notes reducer', () => {
  const notes = createNotes();

  test('Undefined returns initial state', () => {
    expect(
      reducer(undefined, makePackAction(LIFECYCLE.SUCCESS, 'INVALID'))
    ).toEqual(getInitialState());
  });

  describe('GET_NOTES', () => {
    describe('start', () => {
      test('sets isLoading to true', () => {
        expect(
          reducer(undefined, makePackAction(LIFECYCLE.START, 'GET_NOTES'))
        ).toMatchObject({ isLoading: true });
      });
    });
    describe('success', () => {
      test('sets the notes', () => {
        expect(
          reducer(
            undefined,
            makePackAction(LIFECYCLE.SUCCESS, 'GET_NOTES', notes)
          )
        ).toMatchObject(expectedNotes());
      });
      test('sets isLoading to false', () => {
        expect(
          reducer(
            { ...getInitialState(), isLoading: true },
            makePackAction(LIFECYCLE.SUCCESS, 'GET_NOTES', notes)
          )
        ).toMatchObject({ isLoading: false });
      });
    });

    describe('failure', () => {
      test('sets isLoading to false', () => {
        expect(
          reducer(
            { ...getInitialState(), isLoading: true },
            makePackAction(LIFECYCLE.FAILURE, 'GET_NOTES')
          )
        ).toMatchObject({ isLoading: false });
      });
    });
  });

  describe('SET_NOTE', () => {
    describe('success', () => {
      const payload: JudgeNote = {
        danceId: 'dance',
        criterionId: 'crit',
        participantId: 'p1',
        judgeId: 'judge',
        value: 5
      };
      const expected = {
        p1: { crit: { ...payload } }
      };
      test('sets the note', () => {
        expect(
          reducer(
            { ...getInitialState(), isLoading: true },
            makePackAction(LIFECYCLE.SUCCESS, 'SET_NOTE', payload)
          )
        ).toMatchObject(expected);
      });
    });
  });
});

function createNotes(): Array<JudgeNote> {
  return [
    {
      participantId: 'p1',
      criterionId: 'c1',
      judgeId: 'judge',
      danceId: 'dance',
      value: 1
    },
    {
      participantId: 'p1',
      criterionId: 'c2',
      judgeId: 'judge',
      danceId: 'dance',
      value: 2
    },
    {
      participantId: 'p2',
      criterionId: 'c1',
      judgeId: 'judge',
      danceId: 'dance',
      value: 3
    },
    {
      participantId: 'p2',
      criterionId: 'c2',
      judgeId: 'judge',
      danceId: 'dance',
      value: 4
    }
  ];
}

function expectedNotes() {
  return {
    p1: {
      c1: {
        participantId: 'p1',
        criterionId: 'c1',
        judgeId: 'judge',
        danceId: 'dance',
        value: 1
      },
      c2: {
        participantId: 'p1',
        criterionId: 'c2',
        judgeId: 'judge',
        danceId: 'dance',
        value: 2
      }
    },
    p2: {
      c1: {
        participantId: 'p2',
        criterionId: 'c1',
        judgeId: 'judge',
        danceId: 'dance',
        value: 3
      },
      c2: {
        participantId: 'p2',
        criterionId: 'c2',
        judgeId: 'judge',
        danceId: 'dance',
        value: 4
      }
    }
  };
}

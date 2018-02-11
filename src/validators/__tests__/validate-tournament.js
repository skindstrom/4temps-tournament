// @flow

import moment from 'moment';

import validateTournament from '../validate-tournament';
import { createTournament } from '../../test-utils';

describe('Tournament validator', () => {
  test('Valid tournament is valid', () => {
    const tournament = createTournament();

    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(true);
    expect(validation.isValidDate).toBe(true);
    expect(validation.isValidName).toBe(true);
    expect(validation.isValidType).toBe(true);
  });

  test('Empty name is invalid', () => {
    const tournament = { ...createTournament(), name: '' };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(false);
    expect(validation.isValidName).toBe(false);

    expect(validation.isValidType).toBe(true);
  });

  describe('Tournament type must be valid', () => {
    test('Tournament type must be set', () => {
      const tournament = { ...createTournament(), type: 'none' };
      const validation = validateTournament(tournament);

      expect(validation.isValidTournament).toBe(false);
      expect(validation.isValidType).toBe(false);
    });

    test('Tournament type may be jj', () => {
      const tournament = { ...createTournament(), type: 'jj' };
      const validation = validateTournament(tournament);

      expect(validation.isValidTournament).toBe(true);
      expect(validation.isValidType).toBe(true);
    });

    test('Tournament type may be classic', () => {
      const tournament = { ...createTournament(), type: 'classic' };
      const validation = validateTournament(tournament);

      expect(validation.isValidTournament).toBe(true);
      expect(validation.isValidType).toBe(true);
    });

    test('Tournament type must adhere to union type', () => {
      const tournament = {
        ...createTournament(),
        // $FlowFixMe (ignored on purpose)
        type: 'some other type'
      };
      const validation = validateTournament(tournament);

      expect(validation.isValidTournament).toBe(false);
      expect(validation.isValidType).toBe(false);
    });
  });

  test('Unix epoch is invalid date', () => {
    const tournament = { ...createTournament(), date: moment(0) };
    const validation = validateTournament(tournament);

    expect(validation.isValidTournament).toBe(false);
    expect(validation.isValidDate).toBe(false);
  });
});

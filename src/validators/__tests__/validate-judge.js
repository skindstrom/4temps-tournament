// @flow

import validateJudge from '../validate-judge';
import {createJudge} from '../../test-utils';

describe('Judge validator', () => {
  test('Empty name is invalid', () => {
    expect(validateJudge({...createJudge(), name: ''})).toBe(false);
  });

  test('Non-empty name is valid', () => {
    expect(validateJudge({...createJudge(), name: 'Something'})).toBe(true);
  });
});

// @flow

import validateRound from '../../../validators/validate-round';
import parseRound from '../utils';

describe('Round route utils', () => {
  test('parseResponse default initializes an invalid round ', done => {
    validateRound(parseRound(null));
    done();
  });

  test('parseResponse creates an object that does not crash the validator', done => {
    validateRound(parseRound({ name: undefined }));
    done();
  });
});

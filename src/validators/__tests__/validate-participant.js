// @flow

import { validateParticipant } from '../validate-participant';
import { createParticipant } from '../../test-utils';

test('An empty name is invalid', () => {
  expect(
    validateParticipant({ ...createParticipant(), name: '' })
  ).toMatchObject({
    isValidParticipant: false,
    isValidName: false
  });

  expect(
    validateParticipant({
      ...createParticipant(),
      name: 'sweet'
    })
  ).toMatchObject({ isValidName: true });
});

test('Any role other than "none" is valid', () => {
  expect(
    validateParticipant({
      ...createParticipant(),
      role: 'none'
    })
  ).toMatchObject({ isValidParticipant: false, isValidRole: false });
  expect(
    validateParticipant({
      ...createParticipant(),
      role: 'leader'
    })
  ).toMatchObject({ isValidRole: true });
  expect(
    validateParticipant({
      ...createParticipant(),
      role: 'follower'
    })
  ).toMatchObject({ isValidRole: true });
  expect(
    validateParticipant({
      ...createParticipant(),
      role: 'leaderAndFollower'
    })
  ).toMatchObject({ isValidRole: true });
});

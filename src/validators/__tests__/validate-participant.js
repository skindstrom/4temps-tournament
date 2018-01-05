// @flow

import { validateParticipant } from '../validate-participant';

test('An empty name is invalid', () => {
  expect(validateParticipant({ name: '', role: 'leader' }))
    .toMatchObject({
      isValidParticipant: false,
      isValidName: false
    });

  expect(validateParticipant({ name: 'sweet', role: 'leader' }))
    .toMatchObject({ isValidName: true });
});

test('Any role other than "none" is valid', () => {
  expect(validateParticipant({ name: 'name', role: 'none' }))
    .toMatchObject({ isValidParticipant: false, isValidRole: false });
  expect(validateParticipant({ name: 'name', role: 'leader' }))
    .toMatchObject({ isValidRole: true });
  expect(validateParticipant({ name: 'name', role: 'follower' }))
    .toMatchObject({ isValidRole: true });
  expect(validateParticipant({ name: 'name', role: 'leaderAndFollower' }))
    .toMatchObject({ isValidRole: true });
});
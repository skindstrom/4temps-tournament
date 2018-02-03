// @flow

import { validateParticipant } from '../validate-participant';

test('An empty name is invalid', () => {
  expect(validateParticipant({ id: '', name: '', role: 'leader' }))
    .toMatchObject({
      isValidParticipant: false,
      isValidName: false
    });

  expect(validateParticipant({ id: '', name: 'sweet', role: 'leader' }))
    .toMatchObject({ isValidName: true });
});

test('Any role other than "none" is valid', () => {
  expect(validateParticipant({ id: '', name: 'name', role: 'none' }))
    .toMatchObject({ isValidParticipant: false, isValidRole: false });
  expect(validateParticipant({ id: '', name: 'name', role: 'leader' }))
    .toMatchObject({ isValidRole: true });
  expect(validateParticipant({ id: '', name: 'name', role: 'follower' }))
    .toMatchObject({ isValidRole: true });
  expect(validateParticipant({
    id: '',
    name: 'name',
    role: 'leaderAndFollower'
  }))
    .toMatchObject({ isValidRole: true });
});

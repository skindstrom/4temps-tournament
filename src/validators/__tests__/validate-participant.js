// @flow

import { validateParticipant } from '../validate-participant';

test('An empty name is invalid', () => {
  expect(
    validateParticipant({ id: '', name: '', role: 'leader', isAttending: true })
  ).toMatchObject({
    isValidParticipant: false,
    isValidName: false
  });

  expect(
    validateParticipant({
      id: '',
      name: 'sweet',
      role: 'leader',
      isAttending: true
    })
  ).toMatchObject({ isValidName: true });
});

test('Any role other than "none" is valid', () => {
  expect(
    validateParticipant({
      id: '',
      name: 'name',
      role: 'none',
      isAttending: true
    })
  ).toMatchObject({ isValidParticipant: false, isValidRole: false });
  expect(
    validateParticipant({
      id: '',
      name: 'name',
      role: 'leader',
      isAttending: true
    })
  ).toMatchObject({ isValidRole: true });
  expect(
    validateParticipant({
      id: '',
      name: 'name',
      role: 'follower',
      isAttending: true
    })
  ).toMatchObject({ isValidRole: true });
  expect(
    validateParticipant({
      id: '',
      name: 'name',
      role: 'leaderAndFollower',
      isAttending: true
    })
  ).toMatchObject({ isValidRole: true });
});

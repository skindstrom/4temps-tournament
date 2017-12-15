// @flow

import validateUserLogin from '../validate-user-login';
import type { UserCredentials } from '../../models/user';

test('Valid info is valid', () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = validateUserLogin(user);

  expect(result.isValid).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Email has to be valid', () => {
  const emails = ['@test.com', 't@t', 't@.com'];
  const users: Array<UserCredentials> = emails.map((email) => ({
    email,
    password: 'Password123'
  }));

  for (let i = 0; i < users.length; ++i) {
    const result = validateUserLogin(users[i]);

    expect(result.isValid).toBe(false);
    expect(result.isValidEmail).toBe(false);

    expect(result.isValidPassword).toBe(true);
  }
});

test('Password may not be empty', () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: ''
  };

  const result = validateUserLogin(user);

  expect(result.isValid).toBe(false);
  expect(result.isValidPassword).toBe(false);

  expect(result.isValidEmail).toBe(true);
});
// @flow

import validateUserLogin from '../validate-user-login';
import type { UserCredentials } from '../../models/user';
import type { UserModel } from '../../data/user';

test('Valid info is valid', async () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = await validateUserLogin(user);

  expect(result.isValid).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
  expect(result.doesUserExist).toBe(true);
});

test('Email has to be valid', async () => {
  const emails = ['@test.com', 't@t', 't@.com'];
  const users: Array<UserCredentials> = emails.map((email) => ({
    email,
    password: 'Password123'
  }));

  for (let i = 0; i < users.length; ++i) {
    const result = await validateUserLogin(users[i]);

    expect(result.isValid).toBe(false);
    expect(result.isValidEmail).toBe(false);

    expect(result.isValidPassword).toBe(true);
    expect(result.doesUserExist).toBe(true);
  }
});

test('Password may not be empty', async () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: ''
  };

  const result = await validateUserLogin(user);

  expect(result.isValid).toBe(false);
  expect(result.isValidPassword).toBe(false);

  expect(result.isValidEmail).toBe(true);
  expect(result.doesUserExist).toBe(true);
});

test('Returns valid user if exists', async () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const fullUser: UserModel = {
    _id: '12312',
    email: user.email,
    firstName: 'Test',
    lastName: 'WopWop',
    password: 'asdasdasd',
  };

  const result = await validateUserLogin(user,
    () => new Promise((resolve) => resolve(fullUser)));

  expect(result.isValid).toBe(true);
  expect(result.doesUserExist).toBe(true);

  expect(result.isValidPassword).toBe(true);
  expect(result.isValidEmail).toBe(true);
});

test('Returns null user if not exists', async () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = await validateUserLogin(user,
    () => new Promise((resolve) => resolve(null)));

  expect(result.isValid).toBe(false);
  expect(result.doesUserExist).toBe(false);

  expect(result.isValidPassword).toBe(true);
  expect(result.isValidEmail).toBe(true);
});
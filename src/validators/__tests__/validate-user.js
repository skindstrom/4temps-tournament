// @flow

import validateUser from '../validate-user';
import type { UserWithPassword } from '../../models/user';

test('Valid object is valid', async () => {
  const user: UserWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };
  const result = await validateUser(user);
  expect(result.isValid).toBe(true);
  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Empty first name is invalid', async () => {
  const user: UserWithPassword = {
    firstName: '',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };
  const result = await validateUser(user);

  expect(result.isValid).toBe(false);
  expect(result.isValidFirstName).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Empty last name is invalid', async () => {
  const user: UserWithPassword = {
    firstName: 'Simon',
    lastName: '',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };

  const result = await validateUser(user);

  expect(result.isValid).toBe(false);
  expect(result.isValidLastName).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Password requires at least 8 characters', async () => {
  const user: UserWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'abc4567'
  };

  const result = await validateUser(user);

  expect(result.isValid).toBe(false);
  expect(result.isValidPassword).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
});

test('Email requires valid format', async () => {
  const emails = ['@test.com', 't@t', 't@.com'];
  const users: Array<UserWithPassword> = emails.map((email) => ({
    firstName: 'Simon',
    lastName: 'Smith',
    email,
    password: 'Password123'
  }));

  for (let i = 0; i < users.length; ++i) {
    const result = await validateUser(users[i]);

    expect(result.isValid).toBe(false);
    expect(result.isValidEmail).toBe(false);

    expect(result.isEmailNotUsed).toBe(true);
    expect(result.isValidFirstName).toBe(true);
    expect(result.isValidLastName).toBe(true);
    expect(result.isValidPassword).toBe(true);
  }
});

test('Email in use is invalid', async () => {
  const getUsers = () => {
    return new Promise(resolve =>
      resolve([{
        _id: 'asdasd',
        firstName: 'Other',
        lastName: 'Other',
        email: 'test@test.com',
        password: 'asasdasdasd'
      }]));
  };

  const user: UserWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'Password123'
  };

  const result = await validateUser(user, getUsers);
  expect(result.isValid).toBe(false);
  expect(result.isEmailNotUsed).toBe(false);

  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidPassword).toBe(true);
});
// @flow

import validateAdmin from '../validate-admin';
import type { AdminWithPassword } from '../../models/admin';

test('Valid object is valid', async () => {
  const admin: AdminWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };
  const result = await validateAdmin(admin);
  expect(result.isValid).toBe(true);
  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Empty first name is invalid', async () => {
  const admin: AdminWithPassword = {
    firstName: '',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };
  const result = await validateAdmin(admin);

  expect(result.isValid).toBe(false);
  expect(result.isValidFirstName).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Empty last name is invalid', async () => {
  const admin: AdminWithPassword = {
    firstName: 'Simon',
    lastName: '',
    email: 'test@test.com',
    password: 'p4ssw0rdh4xxor'
  };

  const result = await validateAdmin(admin);

  expect(result.isValid).toBe(false);
  expect(result.isValidLastName).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
});

test('Password requires at least 8 characters', async () => {
  const admin: AdminWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'abc4567'
  };

  const result = await validateAdmin(admin);

  expect(result.isValid).toBe(false);
  expect(result.isValidPassword).toBe(false);

  expect(result.isEmailNotUsed).toBe(true);
  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidEmail).toBe(true);
});

test('Email requires valid format', async () => {
  const emails = ['@test.com', 't@t', 't@.com'];
  const admins: Array<AdminWithPassword> = emails.map((email) => ({
    firstName: 'Simon',
    lastName: 'Smith',
    email,
    password: 'Password123'
  }));

  for (let i = 0; i < admins.length; ++i) {
    const result = await validateAdmin(admins[i]);

    expect(result.isValid).toBe(false);
    expect(result.isValidEmail).toBe(false);

    expect(result.isEmailNotUsed).toBe(true);
    expect(result.isValidFirstName).toBe(true);
    expect(result.isValidLastName).toBe(true);
    expect(result.isValidPassword).toBe(true);
  }
});

test('Email in use is invalid', async () => {
  const getAdmins = () => {
    return new Promise(resolve =>
      resolve([{
        // $FlowFixMe
        _id: 'asdasd',
        firstName: 'Other',
        lastName: 'Other',
        email: 'test@test.com',
        password: 'asasdasdasd'
      }]));
  };

  const admin: AdminWithPassword = {
    firstName: 'Simon',
    lastName: 'Smith',
    email: 'test@test.com',
    password: 'Password123'
  };

  const result = await validateAdmin(admin, getAdmins);
  expect(result.isValid).toBe(false);
  expect(result.isEmailNotUsed).toBe(false);

  expect(result.isValidFirstName).toBe(true);
  expect(result.isValidLastName).toBe(true);
  expect(result.isValidPassword).toBe(true);
});
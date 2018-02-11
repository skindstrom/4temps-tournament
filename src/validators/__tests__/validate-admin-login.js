// @flow

import validateAdminLogin from '../validate-admin-login';
import type { AdminCredentials } from '../../models/admin';
import type { AdminModel } from '../../data/admin';

test('Valid info is valid', async () => {
  const admin: AdminCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = await validateAdminLogin(admin);

  expect(result.isValid).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
  expect(result.doesAdminExist).toBe(true);
});

test('Email has to be valid', async () => {
  const emails = ['@test.com', 't@t', 't@.com'];
  const admins: Array<AdminCredentials> = emails.map(email => ({
    email,
    password: 'Password123'
  }));

  for (let i = 0; i < admins.length; ++i) {
    const result = await validateAdminLogin(admins[i]);

    expect(result.isValid).toBe(false);
    expect(result.isValidEmail).toBe(false);

    expect(result.isValidPassword).toBe(true);
    expect(result.doesAdminExist).toBe(true);
  }
});

test('Password may not be empty', async () => {
  const admin: AdminCredentials = {
    email: 'test@test.com',
    password: ''
  };

  const result = await validateAdminLogin(admin);

  expect(result.isValid).toBe(false);
  expect(result.isValidPassword).toBe(false);

  expect(result.isValidEmail).toBe(true);
  expect(result.doesAdminExist).toBe(true);
});

test('Returns valid admin if exists', async () => {
  const admin: AdminCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const fullAdmin: AdminModel = {
    // $FlowFixMe
    _id: '12312',
    email: admin.email,
    firstName: 'Test',
    lastName: 'WopWop',
    password: 'asdasdasd'
  };

  const result = await validateAdminLogin(
    admin,
    () => new Promise(resolve => resolve(fullAdmin))
  );

  expect(result.isValid).toBe(true);
  expect(result.doesAdminExist).toBe(true);

  expect(result.isValidPassword).toBe(true);
  expect(result.isValidEmail).toBe(true);
});

test('Returns null admin if not exists', async () => {
  const admin: AdminCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = await validateAdminLogin(
    admin,
    () => new Promise(resolve => resolve(null))
  );

  expect(result.isValid).toBe(false);
  expect(result.doesAdminExist).toBe(false);

  expect(result.isValidPassword).toBe(true);
  expect(result.isValidEmail).toBe(true);
});

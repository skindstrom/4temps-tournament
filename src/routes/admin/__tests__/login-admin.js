// @flow
import { Types } from 'mongoose';
import { loginAdminRoute } from '../login-admin';

import type { AdminCredentials } from '../../../models/admin';
import type { AdminModel } from '../../../data/admin';

const setSessionUser = () => { return; };

test('If credentials are valid, the session is set', (done) => {
  const credentials: AdminCredentials = {
    email: 'test@gmail.com',
    password: 'password'
  };
  const admin: AdminModel = {
    _id: new Types.ObjectId(),
    firstName: 'John',
    lastName: 'Smith',
    password: 'password',
    email: 'test@gmail.com'
  };

  const setSessionUser = (admin) => {
    expect(admin).toEqual(admin);
    done();
  };
  const getAdmin = () => new Promise(resolve => resolve(admin));

  loginAdminRoute(credentials, setSessionUser, getAdmin);
});

test('If credentials are valid, returns status 200', async () => {
  const credentials: AdminCredentials = {
    email: 'test@gmail.com',
    password: 'password'
  };
  const admin: AdminModel = {
    _id: new Types.ObjectId(),
    firstName: 'John',
    lastName: 'Smith',
    password: 'password',
    email: 'test@gmail.com'
  };

  const getAdmin = () => new Promise(resolve => resolve(admin));

  expect((await loginAdminRoute(credentials, setSessionUser, getAdmin)).status)
    .toBe(200);
});

test('Credentials are validated', async () => {
  const credentials: AdminCredentials = {
    email: '',
    password: 'password'
  };

  const getAdmin = () => new Promise(resolve => resolve(null));

  expect((await loginAdminRoute(credentials, setSessionUser, getAdmin)).body)
    .toEqual({
      isValid: false,
      isValidEmail: false,
      isValidPassword: true,
      doesAdminExist: false
    });
});

test('Invalid credentials return status 400', async () => {
  const credentials: AdminCredentials = {
    email: '',
    password: 'password'
  };

  const getAdmin = () => new Promise(resolve => resolve({
    _id: new Types.ObjectId(),
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  }));

  expect((await loginAdminRoute(credentials, setSessionUser, getAdmin)).status)
    .toBe(400);
});

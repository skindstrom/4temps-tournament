// @flow
import { Types } from 'mongoose';
import { loginUserRoute } from '../login-user';

import type { UserCredentials } from '../../../models/user';
import type { UserModel } from '../../../data/user';

const setSessionUser = () => { return; };

test('If credentials are valid, the session is set', (done) => {
  const credentials: UserCredentials = {
    email: 'test@gmail.com',
    password: 'password'
  };
  const user: UserModel = {
    _id: new Types.ObjectId(),
    firstName: 'John',
    lastName: 'Smith',
    password: 'password',
    email: 'test@gmail.com'
  };

  const setSessionUser = (user) => {
    expect(user).toEqual(user);
    done();
  };
  const getUser = () => new Promise(resolve => resolve(user));

  loginUserRoute(credentials, setSessionUser, getUser);
});

test('If credentials are valid, returns status 200', async () => {
  const credentials: UserCredentials = {
    email: 'test@gmail.com',
    password: 'password'
  };
  const user: UserModel = {
    _id: new Types.ObjectId(),
    firstName: 'John',
    lastName: 'Smith',
    password: 'password',
    email: 'test@gmail.com'
  };

  const getUser = () => new Promise(resolve => resolve(user));

  expect((await loginUserRoute(credentials, setSessionUser, getUser)).status)
    .toBe(200);
});

test('Credentials are validated', async () => {
  const credentials: UserCredentials = {
    email: '',
    password: 'password'
  };

  const getUser = () => new Promise(resolve => resolve(null));

  expect((await loginUserRoute(credentials, setSessionUser, getUser)).body)
    .toEqual({
      isValid: false,
      isValidEmail: false,
      isValidPassword: true,
      doesUserExist: false
    });
});

test('Invalid credentials return status 400', async () => {
  const credentials: UserCredentials = {
    email: '',
    password: 'password'
  };

  const getUser = () => new Promise(resolve => resolve({
    _id: new Types.ObjectId(),
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  }));

  expect((await loginUserRoute(credentials, setSessionUser, getUser)).status)
    .toBe(400);
});
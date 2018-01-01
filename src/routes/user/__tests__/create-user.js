// @flow
import { createUserRoute } from '../create-user';
import type { UserWithPassword } from '../../../models/user';

test('Validates tournament', async () => {
  const user: UserWithPassword = {
    firstName: 'Test',
    lastName: '',
    email: 'test@gmail.com',
    password: '1234567'
  };

  const createUser = () => new Promise(resolve => resolve(false));
  const getUsers = () => new Promise(resolve => resolve([]));

  expect((await createUserRoute(user, createUser, getUsers)).body)
    .toEqual({
      isValid: false,
      isValidFirstName: true,
      isValidLastName: false,
      isValidEmail: true,
      isEmailNotUsed: true,
      isValidPassword: false
    });
});

test('Used email returns 409 status', async () => {
  const user: UserWithPassword = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createUser = () => new Promise(resolve => resolve(false));
  const getUsers = () =>
    // Not the actual type used
    // $FlowFixMe
    new Promise(resolve => resolve([{ email: 'test@gmail.com' }]));

  expect((await createUserRoute(user, createUser, getUsers)).status)
    .toBe(409);
});

test('A valid user that could not be created returns status 500', async () => {
  const user: UserWithPassword = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createUser = () => new Promise(resolve => resolve(false));
  const getUsers = () => new Promise(resolve => resolve([]));

  expect((await createUserRoute(user, createUser, getUsers)).status)
    .toBe(500);
});

test('Invalid user with unused email returns status 400', async () => {
  const user: UserWithPassword = {
    firstName: '',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createUser = () => new Promise(resolve => resolve(true));
  const getUsers = () => new Promise(resolve => resolve([]));

  expect((await createUserRoute(user, createUser, getUsers)).status)
    .toBe(400);
});
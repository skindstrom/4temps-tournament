// @flow
import { createAdminRoute } from '../create-admin';
import type { AdminWithPassword } from '../../../models/admin';

test('Validates tournament', async () => {
  const admin: AdminWithPassword = {
    firstName: 'Test',
    lastName: '',
    email: 'test@gmail.com',
    password: '1234567'
  };

  const createAdmin = () => new Promise(resolve => resolve(false));
  const getAdmins = () => new Promise(resolve => resolve([]));

  expect((await createAdminRoute(admin, createAdmin, getAdmins)).body)
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
  const admin: AdminWithPassword = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createAdmin = () => new Promise(resolve => resolve(false));
  const getAdmins = () =>
    // Not the actual type used
    // $FlowFixMe
    new Promise(resolve => resolve([{ email: 'test@gmail.com' }]));

  expect((await createAdminRoute(admin, createAdmin, getAdmins)).status)
    .toBe(409);
});

test('A valid admin that could not be created returns status 500', async () => {
  const admin: AdminWithPassword = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createAdmin = () => new Promise(resolve => resolve(false));
  const getAdmins = () => new Promise(resolve => resolve([]));

  expect((await createAdminRoute(admin, createAdmin, getAdmins)).status)
    .toBe(500);
});

test('Invalid admin with unused email returns status 400', async () => {
  const admin: AdminWithPassword = {
    firstName: '',
    lastName: 'Smith',
    email: 'test@gmail.com',
    password: 'password'
  };

  const createAdmin = () => new Promise(resolve => resolve(true));
  const getAdmins = () => new Promise(resolve => resolve([]));

  expect((await createAdminRoute(admin, createAdmin, getAdmins)).status)
    .toBe(400);
});
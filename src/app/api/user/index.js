// @flow

import validateUser from '../../../validators/validate-user';
import validateUserLogin from '../../../validators/validate-user-login';

import type { UserCredentials, UserWithPassword } from '../../../models/user';
import type { UserLoginValidationSummary } from
  '../../../validators/validate-user-login';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';

export const createUser =
  async (user: UserWithPassword): Promise<UserCreateValidationSummary> => {
    let result = await validateUser(user);
    if (!result.isValid) {
      return result;
    }
    let httpResult = await fetch('/api/user/create',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
      });

    result = httpResult.json();
    return result;
  };

export const loginUser =
  async (credentials: UserCredentials): Promise<UserLoginValidationSummary> => {
    let result = await validateUserLogin(credentials);
    if (!result.isValid) {
      return result;
    }

    let httpResult = await fetch('/api/user/login',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(credentials)
      });

    const { validation } = await httpResult.json();

    return validation;
  };
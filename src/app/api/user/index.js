// @flow
import {
  apiPostRequest,
} from '../util';

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
      throw result;
    }
    return apiPostRequest('/api/user/create', user);
  };

export const loginUser =
  async (
    credentials: UserCredentials): Promise<UserLoginValidationSummary> => {
    let result = await validateUserLogin(credentials);
    if (!result.isValid) {
      throw result;
    }

    return apiPostRequest('/api/user/login', credentials);
  };

export const logoutUser = async (): Promise<boolean> => {
  return apiPostRequest('/api/user/logout');
};
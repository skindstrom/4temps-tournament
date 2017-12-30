// @flow
import {
  apiPostRequest,
} from '../util';
import type { ApiRequest } from '../util';

import validateUser from '../../../validators/validate-user';
import validateUserLogin from '../../../validators/validate-user-login';

import type { UserCredentials, UserWithPassword } from '../../../models/user';
import type { UserLoginValidationSummary } from
  '../../../validators/validate-user-login';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';

export const createUser =
  async (user: UserWithPassword): ApiRequest<UserCreateValidationSummary> => {
    let result = await validateUser(user);
    if (!result.isValid) {
      return result;
    }
    return apiPostRequest('/api/user/create', user);
  };

export const loginUser =
  async (
    credentials: UserCredentials): ApiRequest<UserLoginValidationSummary> => {
    let result = await validateUserLogin(credentials);
    if (!result.isValid) {
      return result;
    }

    return apiPostRequest('/api/user/login', credentials);
  };

export const logoutUser = async (): ApiRequest<boolean> => {
  return apiPostRequest('/api/user/logout');
};
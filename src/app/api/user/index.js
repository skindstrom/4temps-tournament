// @flow

import type { UserWithPassword } from '../../../models/user';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';
import validateUser from '../../../validators/validate-user';

export interface IUserApi {
  static createUser(user: UserWithPassword):
    Promise<UserCreateValidationSummary>;
}

class UserApi implements IUserApi {
  static async createUser(
    user: UserWithPassword): Promise<UserCreateValidationSummary> {
    return validateUser(user);
  }
}

export default UserApi;
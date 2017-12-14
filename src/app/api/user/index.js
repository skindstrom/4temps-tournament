// @flow

import type { UserWithPassword } from '../../../models/user';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';
import validateUser from '../../../validators/validate-user';

export const createUser =
  async (user: UserWithPassword): Promise<UserCreateValidationSummary> => {
    let result = await validateUser(user);
    if (!result.isValid) {
      return result;
    }
    let httpResult = await fetch("/api/user/create",
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

export default createUser;
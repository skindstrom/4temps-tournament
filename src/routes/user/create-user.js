// @flow
import type { $Request, $Response } from 'express';

import validateUser from '../../validators/validate-user';
import type { RouteResult } from '../util';
import type { UserCreateValidationSummary } from
  '../../validators/validate-user';
import { createUser, getUsers } from '../../data/user';
import type { UserModel } from '../../data/user';
import type { UserWithPassword } from '../../models/user';

export const createUserRoute =
  async (user: UserWithPassword,
    createUser: (user: UserWithPassword) => Promise<boolean>,
    getUsers: () =>
      Promise<Array<UserModel>>): RouteResult<UserCreateValidationSummary> => {
    let status = 200;
    const validation = await validateUser(user, getUsers);

    if (validation.isValid) {
      const success = await createUser(user);
      if (!success) {
        status = 500;
      }
    } else if (!validation.isEmailNotUsed) {
      status = 409;
    } else {
      status = 400;
    }

    return {
      status,
      body: validation
    };
  };

export default async (req: $Request, res: $Response) => {
  const user: UserWithPassword = {
    email: req.body.email || '',
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    password: req.body.password || ''
  };

  const { status, body } = await createUserRoute(user, createUser, getUsers);
  res.status(status);
  res.json(body);
};
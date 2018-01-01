// @flow
import type { $Request, $Response } from 'express';
import type { UserCredentials } from '../../models/user';
import type { UserModel } from '../../data/user';
import validateUserLogin from '../../validators/validate-user-login';
import type { UserLoginValidationSummary } from
  '../../validators/validate-user-login';
import { getUserFromCredentials } from '../../data/user';
import type { RouteResult } from '../util';

export const loginUserRoute =
  async (credentials: UserCredentials,
    setSessionUser: (user: UserModel) => void,
    getUser: (user: UserCredentials)
      => Promise<?UserModel>): RouteResult<UserLoginValidationSummary> => {
    let status: number = 200;

    const validation =
      await validateUserLogin(credentials, getUser);

    if (validation.isValid) {
      const user = await getUser(credentials);

      // user should always be non-null if validation went through
      if (user != null) {
        setSessionUser(user);
      } else {
        status = 500;
      }
    } else {
      status = 400;
    }

    return { status, body: validation };
  };

export default async (req: $Request, res: $Response) => {
  const credentials: UserCredentials = {
    email: req.body.email || '',
    password: req.body.password || ''
  };

  const setSessionUser = (user: UserModel) => {
    // Find out how to update the flow-typed express request
    // $FlowFixMe
    req.session.user = user;
  };

  const { status, body } = await loginUserRoute(credentials,
    setSessionUser,
    getUserFromCredentials);

  res.status(status);
  res.json(body);
};
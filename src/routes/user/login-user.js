// @flow
import type { $Request, $Response } from 'express';
import type { UserCredentials } from '../../models/user';
import validateUserLogin from '../../validators/validate-user-login';
import { getUserFromCredentials } from '../../data/user';

export default async (req: $Request, res: $Response) => {
  const credentials: UserCredentials = {
    email: req.body.email || '',
    password: req.body.password || ''
  };

  let status: number = 200;

  const validation =
    await validateUserLogin(credentials, getUserFromCredentials);

  if (validation.isValid) {
    const user = await getUserFromCredentials(credentials);

    // user should always be non-null if validation went through
    if (user != null) {
      // $FlowFixMe
      req.session.user = user;
    } else {
      status = 500;
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json(validation);
};
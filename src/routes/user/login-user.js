// @flow
import type { $Request, $Response } from 'express';
import type { UserCredentials } from '../../models/user';
import validateUserLogin from '../../validators/validate-user-login';
import { getUser } from '../../data/user';

export default async (req: $Request, res: $Response) => {
  const credentials: UserCredentials = {
    email: req.body.email || '',
    password: req.body.password || ''
  };

  const validation = await validateUserLogin(credentials, getUser);
  if (validation.isValid) {
    // TODO: generate some token and also return it
    res.status(200);
  } else {
    res.status(400);
  }

  res.json(validation);
};

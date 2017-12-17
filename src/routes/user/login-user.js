// @flow
import jwt from 'jsonwebtoken';
import type { $Request, $Response } from 'express';
import type { UserCredentials } from '../../models/user';
import validateUserLogin from '../../validators/validate-user-login';
import { getUser } from '../../data/user';
import { appendToken } from '../../data/token';
import type { UserModel } from '../../data/user';

const createTemporaryToken = (user: UserModel): string => {
  const { _id } = user;
  // TODO: use environment variable for secret
  return jwt.sign({ userId: _id }, 'secret', { expiresIn: 60 * 60 });
};

const createRefreshToken = (user: UserModel): string => {
  const { _id } = user;
  // TODO: use environment variable for secret
  return jwt.sign({ userId: _id }, 'another_secret');
};

export default async (req: $Request, res: $Response) => {
  const credentials: UserCredentials = {
    email: req.body.email || '',
    password: req.body.password || ''
  };

  let status: number = 200;

  const validation = await validateUserLogin(credentials, getUser);
  let temporaryToken: string = '';
  let refreshToken: string = '';
  if (validation.isValid) {
    const user = await getUser(credentials);
    // there _should_ always be a user here if the validation went through
    if (user) {
      temporaryToken = createTemporaryToken(user);
      refreshToken = createRefreshToken(user);

      if (!await appendToken(user._id, refreshToken)) {
        status = 500;
      }
    } else {
      status = 500;
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json({ validation, temporaryToken, refreshToken });
};

// @flow
import { Router } from 'express';
import type { $Request, $Response } from 'express';
import type { UserCredentials, UserWithPassword } from '../../models/user';
import validateUser from '../../validators/validate-user';
import validateUserLogin from '../../validators/validate-user-login';
import { createUser, getUsers, getUser } from '../../data/user';

const router = Router();

router.post('/create', async (req: $Request, res: $Response) => {
  const user: UserWithPassword = {
    email: req.body.email || '',
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    password: req.body.password || ''
  };

  const validation = await validateUser(user, getUsers);
  if (validation.isValid) {
    const success = await createUser(user);
    if (success) {
      res.status(200);
    } else {
      res.status(500);
    }
  } else if (!validation.isEmailNotUsed) {
    res.status(409);
  } else {
    res.status(400);
  }

  res.json(validation);
});

router.post('/login', async (req: $Request, res: $Response) => {
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
});

export default router;
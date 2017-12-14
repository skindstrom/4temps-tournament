// @flow
import { Router } from 'express';
import type { $Request, $Response } from 'express';
import type { User, UserWithPassword } from '../models/user';
import validateUser from '../validators/validate-user';

let users: Array<User> = [];

const router = Router();

router.post('/create', (req: $Request, res: $Response) => {
  const user: UserWithPassword = {
    email: req.body.email || '',
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    password: req.body.password || ''
  };

  const validation = validateUser(user, () => users);
  if (validation.isValid) {
    users.push({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    res.status(200);
  } else if (!validation.isEmailNotUsed) {
    res.status(409);
  } else {
    res.status(400);
  }

  res.json(validation);
});

export default router;
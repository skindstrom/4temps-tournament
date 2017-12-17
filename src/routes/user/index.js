// @flow
import { Router } from 'express';

import createUser from './create-user';
import loginUser from './login-user';

const router = Router();

router.post('/create', createUser);

router.post('/login', loginUser);

export default router;
// @flow
import { Router } from 'express';

import createUser from './create-user';
import loginUser from './login-user';
import logoutUser from './logout-user';

const router = Router();

router.post('/create', createUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
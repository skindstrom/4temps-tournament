// @flow
import { Router } from 'express';

import createAdmin from './create-admin';
import loginAdmin from './login-admin';
import logoutAdmin from './logout-admin';

const router = Router();

router.post('/create', createAdmin);

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

export default router;

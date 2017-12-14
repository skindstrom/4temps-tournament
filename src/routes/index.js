// @flow

import { Router } from 'express';

import UserRoute from './user';

const router = Router();

router.use('/user', UserRoute);

export default router;
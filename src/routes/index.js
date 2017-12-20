// @flow

import { Router } from 'express';

import UserRoute from './user';
import TournamentRoute from './tournament';

const router = Router();

router.use('/user', UserRoute);
router.use('/tournament', TournamentRoute);

export default router;
// @flow

import { Router } from 'express';

import UserRoute from './user';
import TournamentRoute from './tournament';
import ParticipantRoute from './participant';

const router = Router();

router.use('/user', UserRoute);
router.use('/tournament', TournamentRoute);
router.use('/participant', ParticipantRoute);

export default router;
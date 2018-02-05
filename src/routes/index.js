// @flow

import { Router } from 'express';

import AdminRoute from './admin';
import TournamentRoute from './tournament';
import ParticipantRoute from './participant';
import RoundRoute from './round';
import JudgeRoute from './judge';

const router = Router();

router.use('/admin', AdminRoute);
router.use('/tournament', TournamentRoute);
router.use('/participant', ParticipantRoute);
router.use('/round', RoundRoute);
router.use('/judge', JudgeRoute);

export default router;

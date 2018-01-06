// @flow

import { Router } from 'express';
import isUserAuthenticated from '../auth-middleware';

import createParticipant from './create-participant';
import getParticipants from './get-participants';

const router = Router();

router.post('/create', isUserAuthenticated, createParticipant);
router.get('/get/tournament/:tournamentId', isUserAuthenticated,
  getParticipants);

export default router;
// @flow

import { Router } from 'express';
import isUserAuthenticated from '../auth-middleware';

import createParticipant from './create-participant';

const router = Router();

router.post('/create', isUserAuthenticated, createParticipant);

export default router;
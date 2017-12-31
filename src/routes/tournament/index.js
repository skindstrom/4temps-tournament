// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import createTournament from './create-tournament';
import updateTournament from './update-tournament';
import getUserTournaments from './get-user-tournaments';
import getTournament from './get-tournament';
import getAllTournament from './get-all-tournaments';

const router = Router();

router.post('/create', isUserAuthenticated, createTournament);
router.post('/update', isUserAuthenticated, updateTournament);
router.get('/get', isUserAuthenticated, getUserTournaments);
router.get('/get/:tournamentId', isUserAuthenticated, getTournament);

router.get('/get-all', getAllTournament);

export default router;
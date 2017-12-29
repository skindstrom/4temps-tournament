// @flow

import { Router } from 'express';

import createTournament from './create-tournament';
import getUserTournaments from './get-user-tournaments';
import getTournament from './get-tournament';
import getAllTournament from './get-all-tournaments';

const router = Router();

router.post('/create', createTournament);
router.get('/get', getUserTournaments);
router.get('/get/:tournamentId', getTournament);
router.get('/get-all', getAllTournament);

export default router;
// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';

import createTournament from './create-tournament';
import updateTournament from './update-tournament';
import getUserTournaments from './get-user-tournaments';
import GetTournamentRoute from './get-tournament';
import getAllTournament from './get-all-tournaments';

const router = Router();

router.post('/create', isUserAuthenticated, createTournament);
router.post('/update', isUserAuthenticated, updateTournament);
router.get('/get', isUserAuthenticated, getUserTournaments);
router.get('/get/all', getAllTournament);

const getTournamentRoute =
  new GetTournamentRoute(new TournamentRepositoryImpl());
router.get('/get/:tournamentId', isUserAuthenticated, getTournamentRoute.route);


export default router;

// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';

import CreateTournamentRoute from './create-tournament';
import UpdateTournamentRoute from './update-tournament';
import GetUserTournamentsRoute from './get-user-tournaments';
import GetTournamentRoute from './get-tournament';
import GetAllTournamentsRoute from './get-all-tournaments';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

router.post('/create', isUserAuthenticated,
  new CreateTournamentRoute(tournamentRepository).route);
router.post('/update', isUserAuthenticated,
  new UpdateTournamentRoute(tournamentRepository).route);
router.get('/get', isUserAuthenticated,
  new GetUserTournamentsRoute(tournamentRepository).route);
router.get('/get/all', new GetAllTournamentsRoute(tournamentRepository).route);

router.get('/get/:tournamentId', isUserAuthenticated,
  new GetTournamentRoute(tournamentRepository).route);


export default router;

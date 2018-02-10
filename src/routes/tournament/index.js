// @flow

import { Router } from 'express';

import { allow } from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';

import CreateTournamentRoute from './create-tournament';
import UpdateTournamentRoute from './update-tournament';
import GetUserTournamentsRoute from './get-user-tournaments';
import GetTournamentRoute from './get-tournament';
import GetAllTournamentsRoute from './get-all-tournaments';
import GetJudgeTournamentRoute from './get-judge-tournament';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

router.post('/create', allow('authenticated'),
  new CreateTournamentRoute(tournamentRepository).route);
router.post('/update/:tournamentId', allow('admin'),
  new UpdateTournamentRoute(tournamentRepository).route);
router.get('/get', allow('authenticated'),
  new GetUserTournamentsRoute(tournamentRepository).route);
router.get('/get/all', new GetAllTournamentsRoute(tournamentRepository).route);
router.get('/get/judge',
  new GetJudgeTournamentRoute(tournamentRepository).route);
router.get('/get/:tournamentId', allow('authenticated'),
  new GetTournamentRoute(tournamentRepository).route);

export default router;

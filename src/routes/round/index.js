// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import { TournamentRepositoryImpl } from '../../data/tournament';
import CreateRoundRoute from './create-round';
import DeleteRoundRoute from './delete-round';

const router = Router();

const tournamentRepository = new TournamentRepositoryImpl();

const createRoundRoute =
  new CreateRoundRoute(tournamentRepository);
router.post('/create', isUserAuthenticated, createRoundRoute.route);

const deleteRoundRoute =
  new DeleteRoundRoute(tournamentRepository);
router.delete('/delete/:tournamentId/:roundId', isUserAuthenticated,
  deleteRoundRoute.route);

export default router;

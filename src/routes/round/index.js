// @flow

import { Router } from 'express';

import {allow} from '../auth-middleware';

import { TournamentRepositoryImpl } from '../../data/tournament';
import CreateRoundRoute from './create-round';
import DeleteRoundRoute from './delete-round';

const router = Router();

const tournamentRepository = new TournamentRepositoryImpl();

const createRoundRoute =
  new CreateRoundRoute(tournamentRepository);
router.post('/:tournamentId/create', allow('admin'), createRoundRoute.route);

const deleteRoundRoute =
  new DeleteRoundRoute(tournamentRepository);
router.delete('/:tournamentId/delete/:roundId', allow('admin'),
  deleteRoundRoute.route);

export default router;

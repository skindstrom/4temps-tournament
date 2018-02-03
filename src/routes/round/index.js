// @flow

import { Router } from 'express';

import {allow} from '../auth-middleware';

import { TournamentRepositoryImpl } from '../../data/tournament';
import CreateRoundRoute from './create-round';
import DeleteRoundRoute from './delete-round';
import StartRoundRoute from './start-round';

const router = Router();

const tournamentRepository = new TournamentRepositoryImpl();

router.post('/:tournamentId/create', allow('admin'),
  new CreateRoundRoute(tournamentRepository).route);

router.delete('/:tournamentId/delete/:roundId', allow('admin'),
  new DeleteRoundRoute(tournamentRepository).route);

router.post('/:tournamentId/start/:roundId', allow('admin'),
  new StartRoundRoute(tournamentRepository).route);

export default router;

// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import { RoundRepositoryImpl } from '../../data/round';
import { TournamentRepositoryImpl } from '../../data/tournament';
import { CreateRoundRoute } from './create-round';

const router = Router();

const createRoundRoute = new CreateRoundRoute(
  new RoundRepositoryImpl(), new TournamentRepositoryImpl());

router.post('/create', isUserAuthenticated, createRoundRoute.route);

export default router;
// @flow

import { Router } from 'express';

import isUserAuthenticated from '../auth-middleware';

import { RoundRepositoryImpl } from '../../data/round';
import { TournamentRepositoryImpl } from '../../data/tournament';
import { CreateRoundRoute } from './create-round';
import GetRoundsRoute from './get-rounds';
import UpdateRoundsRoute from './update-rounds';

const router = Router();

const tournamentRepository = new TournamentRepositoryImpl();
const roundRepository = new RoundRepositoryImpl();

const createRoundRoute =
  new CreateRoundRoute(roundRepository, tournamentRepository);
router.post('/create', isUserAuthenticated, createRoundRoute.route);

const getRoundsRoute =
  new GetRoundsRoute(tournamentRepository, roundRepository);
router.get('/get', isUserAuthenticated, getRoundsRoute.route);

const updateRoundsRoute =
  new UpdateRoundsRoute(tournamentRepository, roundRepository);
router.post('/update', isUserAuthenticated, updateRoundsRoute.route);

export default router;

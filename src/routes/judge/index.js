// @flow

import { Router } from 'express';
import {allow} from '../auth-middleware';
import createJudgeRoute from './create-judge';
import {TournamentRepositoryImpl} from '../../data/tournament';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

router.post('/:tournamentId/create', allow('admin'),
  createJudgeRoute(tournamentRepository));

export default router;

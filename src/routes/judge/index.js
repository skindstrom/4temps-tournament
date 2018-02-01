// @flow

import { Router } from 'express';
import {allow} from '../auth-middleware';
import createJudgeRoute from './create-judge';
import {TournamentRepositoryImpl} from '../../data/tournament';
import AccessKeyRepositoryImpl from '../../data/access-key';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();
const accessKeyRepository = new AccessKeyRepositoryImpl();

router.post('/:tournamentId/create', allow('admin'),
  createJudgeRoute(tournamentRepository, accessKeyRepository));

export default router;

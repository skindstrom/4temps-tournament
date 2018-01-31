// @flow

import { Router } from 'express';
import {allow} from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';
import {CreateParticipantRoute} from './create-participant';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

const createParticipantRoute =
  new CreateParticipantRoute(tournamentRepository);
router.post(
  '/:tournamentId/create', allow('admin'), createParticipantRoute.route);

export default router;

// @flow

import { Router } from 'express';
import { allow } from '../auth-middleware';

import { TournamentRepositoryImpl } from '../../data/tournament';
import { CreateParticipantRoute } from './create-participant';
import ChangeAttendance from './change-attendance';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

const createParticipantRoute = new CreateParticipantRoute(tournamentRepository);
router.post(
  '/:tournamentId/create',
  allow('admin', 'assistant'),
  createParticipantRoute.route
);

const changeAttendance = new ChangeAttendance(tournamentRepository);
router.post(
  '/:tournamentId/attendance',
  allow('admin', 'assistant'),
  changeAttendance.route
);

export default router;

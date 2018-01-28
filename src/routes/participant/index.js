// @flow

import { Router } from 'express';
import isUserAuthenticated from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';
import ParticipantRepositoryImpl from '../../data/participant';
import {CreateParticipantRoute} from './create-participant';
import getParticipants from './get-participants';

const router = Router();

const createParticipantRoute =
  new CreateParticipantRoute(
    new TournamentRepositoryImpl(), new ParticipantRepositoryImpl());
router.post('/create', isUserAuthenticated, createParticipantRoute.route);
router.get('/get/tournament/:tournamentId', isUserAuthenticated,
  getParticipants);

export default router;

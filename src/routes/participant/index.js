// @flow

import { Router } from 'express';
import isUserAuthenticated from '../auth-middleware';

import {TournamentRepositoryImpl} from '../../data/tournament';
import ParticipantRepositoryImpl from '../../data/participant';
import {CreateParticipantRoute} from './create-participant';
import {GetParticipantsRoute} from './get-participants';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();
const participantRepository = new ParticipantRepositoryImpl();

const createParticipantRoute =
  new CreateParticipantRoute(tournamentRepository, participantRepository);
router.post('/create', isUserAuthenticated, createParticipantRoute.route);


const getParticipantsRoute =
  new GetParticipantsRoute(tournamentRepository, participantRepository);
router.get('/get/tournament/:tournamentId', isUserAuthenticated,
  getParticipantsRoute.route);

export default router;

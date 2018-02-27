// @flow

import { Router } from 'express';

import { allow } from '../auth-middleware';

import { TournamentRepositoryImpl } from '../../data/tournament';
import { SubmittedNoteRepository } from '../../data/note';
import CreateRoundRoute from './create-round';
import DeleteRoundRoute from './delete-round';
import StartRoundRoute from './start-round';
import StartDanceRoute from './start-dance';
import GenerateGroupsRoute from './generate-groups';
import EndDanceRoute from './end-dance';
import RegenerateGroupRoute from './regenerate-group';

const router = Router();

const tournamentRepository = new TournamentRepositoryImpl();
const noteRepository = new SubmittedNoteRepository();

router.post(
  '/:tournamentId/create',
  allow('admin'),
  new CreateRoundRoute(tournamentRepository).route
);

router.delete(
  '/:tournamentId/delete/:roundId',
  allow('admin'),
  new DeleteRoundRoute(tournamentRepository).route
);

router.post(
  '/:tournamentId/start/:roundId',
  allow('admin'),
  new StartRoundRoute(tournamentRepository).route
);

router.post(
  '/:tournamentId/start-dance/',
  allow('admin'),
  new StartDanceRoute(tournamentRepository).route
);

router.post(
  '/:tournamentId/generate-groups/:roundId',
  allow('admin'),
  new GenerateGroupsRoute(tournamentRepository).route
);

router.post(
  '/:tournamentId/end-dance/',
  allow('admin'),
  new EndDanceRoute(tournamentRepository, noteRepository).route()
);

router.post(
  '/:tournamentId/regenerate/:roundId/group/:groupId/',
  RegenerateGroupRoute(tournamentRepository, noteRepository)
);

export default router;

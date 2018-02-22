// @flow

import { Router } from 'express';
import { allow } from '../auth-middleware';
import setNoteRoute from './set-note';
import submitNotesRoute from './submit-notes';
import getNotesForDanceRoute from './get-notes-for-dance';
import { TournamentRepositoryImpl } from '../../data/tournament';
import {
  TemporaryNoteRepository,
  SubmittedNoteRepository
} from '../../data/note';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();
const temporaryNotesRepository = new TemporaryNoteRepository();

router.post(
  '/:tournamentId/temporary/set',
  allow('judge'),
  setNoteRoute(tournamentRepository, temporaryNotesRepository)
);
router.get(
  '/:tournamentId/temporary/dance/:danceId',
  allow('judge'),
  getNotesForDanceRoute(temporaryNotesRepository)
);
router.post(
  '/:tournamentId/final/submit',
  allow('judge'),
  submitNotesRoute(tournamentRepository, new SubmittedNoteRepository())
);

export default router;

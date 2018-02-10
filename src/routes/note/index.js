// @flow

import { Router } from 'express';
import {allow} from '../auth-middleware';
import setNoteRoute from './set-note';
import submitNotesRoute from './submit-notes';
import { TournamentRepositoryImpl } from '../../data/tournament';
import { TemporaryNoteRepository, SubmittedNoteRepository } from
  '../../data/note';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();

router.post('/:tournamentId/set', allow('judge'),
  setNoteRoute(tournamentRepository, new TemporaryNoteRepository()));
router.post('/:tournamentId/submit', allow('judge'),
  submitNotesRoute(tournamentRepository, new SubmittedNoteRepository()));

export default router;

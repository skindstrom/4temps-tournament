// @flow

import { Router } from 'express';
import {allow} from '../auth-middleware';
import setNoteRoute from './set-note';
import { TournamentRepositoryImpl } from '../../data/tournament';
import NoteRepositoryImpl from '../../data/note';

const router = Router();
const tournamentRepository = new TournamentRepositoryImpl();
const noteRepository = new NoteRepositoryImpl();

router.post('/:tournamentId/set', allow('judge'),
  setNoteRoute(tournamentRepository, noteRepository));

export default router;

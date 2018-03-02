// @flow

import { Router } from 'express';
import { allow } from '../auth-middleware';
import { TournamentRepositoryImpl } from '../../data/tournament';
import createLeaderboard from './create-leaderboard';

const router = Router();

router.get('/:tournamentId', allow('public'), getLeaderboard);

const tournamentRepository = new TournamentRepositoryImpl();
async function getLeaderboard(req: ServerApiRequest, res: ServerApiResponse) {
  try {
    const tournament = await tournamentRepository.get(req.params.tournamentId);
    if (tournament == null) {
      res.status(404);
      res.json({ didFindTournament: false });
    } else {
      res.json(createLeaderboard(tournament));
    }
  } catch (e) {
    res.status(500);
    res.json({ serverError: true });
  }
}

export default router;

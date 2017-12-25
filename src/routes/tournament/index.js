// @flow

import { Router } from 'express';
import type { $Request, $Response } from 'express';
import moment from 'moment';

import { createTournament, getTournamentsForUser, getTournaments } from
  '../../data/tournament';
import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';

const router = Router();

router.post('/create', async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user == null) {
    res.sendStatus(401);
    return;
  }

  const tournament: Tournament = {
    name: req.body.name || '',
    date: moment(req.body.date) || moment(0),
    type: req.body.type || 'none'
  };

  let result = {
    validation: validateTournament(tournament),
    tournamentId: null
  };
  let status: number = 200;
  if (result.validation.isValidTournament) {
    result.tournamentId =
      // $FlowFixMe
      await createTournament(req.session.user._id, tournament);
    if (result.tournamentId == null) {
      status = 500;
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json(result);
});

router.get('/get', async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user == null) {
    res.sendStatus(401);
    return;
  }

  const tournaments: Array<Tournament> =
    // $FlowFixMe
    (await getTournamentsForUser(req.session.user._id))
      .map(db => ({ name: db.name, date: moment(db.date), type: db.type }));
  res.status(200);
  res.json(tournaments);
});

router.get('/get-all', async (req: $Request, res: $Response) => {
  const tournaments: Array<Tournament> =
    // $FlowFixMe
    (await getTournaments())
      .map(db => ({ name: db.name, date: moment(db.date), type: db.type }));
  res.status(200);
  res.json(tournaments);
});

export default router;
// @flow

import { Router } from 'express';
import type { $Request, $Response } from 'express';
import moment from 'moment';

import { createTournament, getTournamentsForUser } from '../../data/tournament';
import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';

const router = Router();

router.post('/create', async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user == null) {
    res.sendStatus(301);
    return;
  }

  const tournament: Tournament = {
    name: req.body.name || '',
    date: moment(req.body.date) || moment(0),
    type: req.body.type || 'none'
  };

  const validation = validateTournament(tournament);
  let status: number = 200;
  if (validation.isValidTournament) {
    // $FlowFixMe
    if (!await createTournament(req.session.user._id, tournament)) {
      status = 500;
    }
  } else {
    status = 400;
  }

  res.status(status);
  res.json(validation);
});

router.get('/get', async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user == null) {
    res.sendStatus(301);
    return;
  }

  const tournaments: Array<Tournament> =
    // $FlowFixMe
    (await getTournamentsForUser(req.session.user._id))
      .map(db => ({ name: db.name, date: moment(db.date), type: db.type }));
  res.status(200);
  res.json(tournaments);
});

export default router;
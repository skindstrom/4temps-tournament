// @flow
import type { $Request, $Response } from 'express';
import moment from 'moment';
import type { ObjectId } from 'mongoose';

import validateTournament from '../../validators/validate-tournament';
import type { Tournament } from '../../models/tournament';
import { createTournament } from '../../data/tournament';
import type { RouteResult } from '../util';

export const createTournamentRoute =
  async (userId: string,
    tournament: Tournament,
    createTournament: (userId: string, tournament: Tournament)
      => Promise<?ObjectId>): RouteResult<?Tournament> => {

    const { isValidTournament } = validateTournament(tournament);
    let status: number = 200;

    if (isValidTournament) {
      try {
        await createTournament(userId, tournament);
      } catch (e) {
        status = 500;
      }
    } else {
      status = 400;
    }

    const body = status === 200 ? tournament : null;

    return { status, body };
  };

export default async (req: $Request, res: $Response) => {
  const tournament: Tournament = {
    _id: req.body._id || '',
    name: req.body.name || '',
    date: moment(req.body.date) || moment(0),
    type: req.body.type || 'none'
  };

  // $FlowFixMe
  const userId: string = req.session.user._id;

  const { status, body } =
    await createTournamentRoute(userId, tournament, createTournament);

  res.status(status);
  res.json(body);
};
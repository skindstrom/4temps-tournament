// @flow
import moment from 'moment';
import type { Tournament } from '../../models/tournament';

// $FlowFixMe
export default function parseTournament(body: any): Tournament {
  return {
    _id: body._id || '',
    name: body.name || '',
    date: moment(body.date) || moment(0),
    type: body.type || 'none',
    judges: body.judges || [],
    participants: body.participants || [],
    rounds: body.rounds || [],
    creatorId: body.creatorId,
  };
}

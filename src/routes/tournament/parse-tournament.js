// @flow
import moment from 'moment';

export default function parseTournament(
  //$FlowFixMe
  body: any
): Tournament {
  return {
    id: body.id || '',
    name: body.name || '',
    date: moment(body.date) || moment(0),
    type: body.type || 'none',
    judges: body.judges || [],
    participants: body.participants || [],
    assistants: body.assistants || [],
    rounds: body.rounds || [],
    creatorId: body.creatorId,
    dancesNoted: body.dancesNoted || {}
  };
}

// @flow

import ObjectId from 'bson-objectid';
import type { TournamentRepository } from '../../data/tournament';
import type { AccessKeyRepository } from '../../data/access-key';
import validateAssistant from '../../validators/validate-assistant';

export default function route(
  tournamentRepository: TournamentRepository,
  accessRepository: AccessKeyRepository
) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const assistantName = parseName(req.body);
      const assistant = { name: assistantName, id: ObjectId.generate() };

      if (validateAssistant(assistant)) {
        await tournamentRepository.addAssistant(tournamentId, assistant);
        await accessRepository.createForTournamentAndUserWithRole(
          tournamentId,
          assistant.id,
          'assistant'
        );
        res.json({ tournamentId, assistant });
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      res.sendStatus(statusFromError(e));
    }
  };
}

function parseName(body: mixed): string {
  if (
    typeof body === 'object' &&
    body != null &&
    typeof body.name === 'string'
  ) {
    return body.name;
  }
  throw new ParseError();
}

function statusFromError(e: mixed) {
  if (e instanceof ParseError) {
    return 400;
  }
  return 500;
}

function ParseError() {}

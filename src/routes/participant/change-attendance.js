// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class ChangeAttendance {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (
      typeof req.body === 'object' &&
      req.body != null &&
      typeof req.body.participantId === 'string' &&
      req.body.participantId != null &&
      typeof req.body.isAttending === 'boolean' &&
      req.body.isAttending != null
    ) {
      const { participantId, isAttending } = req.body;
      await this._repository.updateParticipantAttendance(
        participantId,
        isAttending
      );
      res.json(req.body);
    } else {
      res.sendStatus(400);
    }
  };
}

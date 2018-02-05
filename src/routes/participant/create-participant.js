// @flow

import {ObjectID} from 'mongodb';
import type { TournamentRepository } from '../../data/tournament';
import type { Participant } from '../../models/participant';
import { validateParticipant } from '../../validators/validate-participant';

export class CreateParticipantRoute {
  _tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }

    const userId: string = req.session.user.id;

    const handler =
      new CreateParticipantRouteHandler(
        userId, this._tournamentRepository);

    handler.parseBody(req.body);
    await handler.createParticipant();

    res.status(handler.status);
    res.json({
      tournamentId: handler._tournamentId,
      participant: handler._participant
    });
  }
}

export class CreateParticipantRouteHandler {
  status: number = 200;

  _userId: string;
  _tournamentRepository: TournamentRepository;

  _tournamentId: string;
  _participant: Participant;

  constructor(userId: string, tournamentRepository: TournamentRepository) {
    this._userId = userId;
    this._tournamentRepository = tournamentRepository;
  }

  // $FlowFixMe
  parseBody(body: any) {
    this._tournamentId = body.tournamentId || '';

    const participant = body.participant || {};
    this._participant = {
      id: new ObjectID().toString(),
      name: participant.name || '',
      role: participant.role || 'none'
    };
  }

  async createParticipant() {
    if (await this._isValidInput()) {
      await this._createForValidInput();
    } else {
      this.status = await this._reasonForInvalidInput();
    }
  }

  async _isValidInput() {
    return (await this._isValidTournament()) && this._isValidParticipant();
  }

  _isValidParticipant() {
    return validateParticipant(this._participant).isValidParticipant;
  }

  async _isValidTournament() {
    const tournament = await this._tournamentRepository.get(this._tournamentId);
    return tournament != null
      && tournament.creatorId === this._userId;
  }

  async _createForValidInput() {
    try {
      await this._tournamentRepository.createParticipant(
        this._tournamentId, this._participant);
    } catch (e) {
      this.status = 500;
    }
  }

  async _reasonForInvalidInput() {
    let status = 500;

    if (!this._isValidParticipant()) {
      status = 400;
    } else {
      status = this._reasonForInvalidTournament();
    }

    return status;
  }

  async _reasonForInvalidTournament() {
    let status = 500;
    const tournament = await this._tournamentRepository.get(this._tournamentId);
    if (tournament == null) {
      status = 404; // tournament does not exist
    } else if (tournament.creatorId != this._userId) {
      status = 401; // user is not owner of tournament
    }
    return status;
  }
}

export default CreateParticipantRoute;

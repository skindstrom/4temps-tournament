// @flow

import type { $Request, $Response } from 'express';
import type { TournamentRepository } from '../../data/tournament';
import type { ParticipantRepository } from '../../data/participant';
import type { Participant } from '../../models/participant';
import { validateParticipant } from '../../validators/validate-participant';

export class CreateParticipantRoute {
  _tournamentRepository: TournamentRepository;
  _participantRepository: ParticipantRepository;

  constructor(
    tournamentRepository: TournamentRepository,
    participantRepository: ParticipantRepository) {

    this._tournamentRepository = tournamentRepository;
    this._participantRepository = participantRepository;
  }

  route = async (req: $Request, res: $Response) => {
    // $FlowFixMe
    const userId: string = req.session.user._id;

    const handler =
      new CreateParticipantRouteHandler(
        userId, this._tournamentRepository, this._participantRepository);

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
  _participantRepository: ParticipantRepository;

  _tournamentId: string;
  _participant: Participant;

  constructor(userId: string, tournamentRepository: TournamentRepository,
    participantRepository: ParticipantRepository) {
    this._userId = userId;
    this._tournamentRepository = tournamentRepository;
    this._participantRepository = participantRepository;
  }

  parseBody(body: {tournamentId: ?string, participant: ?Participant}) {
    this._tournamentId = body.tournamentId || '';

    const participant = body.participant || {};
    this._participant = {
      _id: participant._id || '',
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
      && tournament.creatorId.toString() === this._userId;
  }

  async _createForValidInput() {
    try {
      await this._participantRepository.createForTournament(this._tournamentId,
        this._participant);
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
    } else if (tournament.creatorId.toString() != this._userId) {
      status = 401; // user is not owner of tournament
    }
    return status;
  }
}

export default CreateParticipantRoute;

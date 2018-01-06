// @flow
import type { $Request, $Response } from 'express';
import type { ParticipantRepository } from '../../data/participant';
import ParticipantRepositoryImpl  from '../../data/participant';
import { getTournament } from '../../data/tournament';
import type { Participant } from '../../models/participant';

type TournamentGetter = typeof getTournament;

export class GetParticipantsRoute {
  status: number = 200;

  _userId: string;
  _participantRepository: ParticipantRepository;
  _tournamentGetter: TournamentGetter;

  _tournamentId: string;

  constructor(userId: string,
    participantRepository: ParticipantRepository,
    tournamentGetter: TournamentGetter) {
    this._userId = userId;
    this._participantRepository = participantRepository;
    this._tournamentGetter = tournamentGetter;
  }

  static async routeRequest(req: $Request, res: $Response) {
    // $FlowFixMe
    const userId: string = req.session.user._id;

    const route = new GetParticipantsRoute(userId,
      new ParticipantRepositoryImpl(), getTournament);

    const participants =
      await route.getParticipantsForTournament(req.params.tournamentId);

    res.status(route.status);
    res.json(participants);
  }

  async getParticipantsForTournament(
    tournamentId: string): Promise<Array<Participant>> {
    this._tournamentId = tournamentId;

    let participants: Array<Participant> = [];
    if (await this._isUserAuthorized()) {
      participants = await this._getParticipantsForAuthorizedUser();
    } else {
      this.status = 401;
    }

    return participants;
  }

  async _isUserAuthorized() {
    const tournament = await this._tournamentGetter(this._tournamentId);
    return tournament != null && tournament.userId.toString() === this._userId;
  }

  async _getParticipantsForAuthorizedUser() {
    let participants: Array<Participant> = [];
    try {
      const dbModels =
        await this._participantRepository.getForTournament(this._tournamentId);
      participants = dbModels.map(a => ({ name: a.name, role: a.role }));
    } catch (e) {
      this.status = 500;
    }

    return participants;
  }
}

export default GetParticipantsRoute.routeRequest;
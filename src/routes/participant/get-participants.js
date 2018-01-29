// @flow
import type { ParticipantRepository } from '../../data/participant';
import type { Participant } from '../../models/participant';
import type {TournamentRepository} from '../../data/tournament';

export class GetParticipantsRoute {
  _participantRepository: ParticipantRepository;
  _tournamentRepository: TournamentRepository;

  constructor(
    tournamentRepository: TournamentRepository,
    participantRepository: ParticipantRepository) {
    this._tournamentRepository = tournamentRepository;
    this._participantRepository = participantRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    // $FlowFixMe
    const userId: string = req.session.user._id;

    const handler = new GetParticipantsRouteHandler(userId,
      this._tournamentRepository, this._participantRepository);

    const tournamentId = req.params.tournamentId;
    const participants =
      await handler.getParticipantsForTournament(tournamentId);

    res.status(handler.status);
    res.json({ tournamentId, participants });
  }
}

export class GetParticipantsRouteHandler {
  status: number = 200;

  _userId: string;
  _participantRepository: ParticipantRepository;
  _tournamentRepository: TournamentRepository;

  _tournamentId: string;

  constructor(userId: string,
    tournamentRepository: TournamentRepository,
    participantRepository: ParticipantRepository) {
    this._userId = userId;
    this._tournamentRepository = tournamentRepository;
    this._participantRepository = participantRepository;
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
    const tournament = await this._tournamentRepository.get(this._tournamentId);
    return tournament != null
      && tournament.creatorId.toString() === this._userId;
  }

  async _getParticipantsForAuthorizedUser() {
    let participants: Array<Participant> = [];
    try {
      participants =
        await this._participantRepository.getForTournament(this._tournamentId);
    } catch (e) {
      this.status = 500;
    }

    return participants;
  }
}

export default GetParticipantsRoute;

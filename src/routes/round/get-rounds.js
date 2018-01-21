// @flow

import type { TournamentRepository } from '../../data/tournament';
import type { RoundRepository } from '../../data/round';
import type { UserModel } from '../../data/user';

class GetRoundRoute {
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;

  constructor(tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new RouteHandler(req.session.user,
      this._tournamentRepository, this._roundRepository);
    try {
      handler.parseQuery(req.query);
      const rounds = await handler.getRounds();

      res.json({ tournamentId: handler._tournamentId, rounds });
    } catch (e) {
      res.sendStatus(e.status);
    }
  };
}

class RouteHandler {
  _user: UserModel;
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;
  _tournamentId: string;

  constructor(user: UserModel, tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._user = user;
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  parseQuery = (query: { [string]: string }) => {
    this._tournamentId = query['tournamentId'];
    if (!this._tournamentId) throw { status: 400 };
  }

  getRounds = async () => {
    if (!await this._userOwnsTournament()) {
      throw { status: 401 };
    }

    return this._roundRepository.getForTournament(this._tournamentId);
  }

  _userOwnsTournament = async () => {
    const tournament = await this._tournamentRepository.get(this._tournamentId);
    if (!tournament) {
      throw { status: 404 };
    }

    return tournament.userId == this._user._id;
  }
}

export default GetRoundRoute;
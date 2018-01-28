// @flow

import type { UserModel } from '../../data/user';
import type { TournamentRepository } from '../../data/tournament';
import type { RoundRepository } from '../../data/round';

class DeleteRoundRoute {
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;

  constructor(tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new DeleteRoundRouteHandler(
      req.session.user, this._tournamentRepository, this._roundRepository);

    try {
      handler.parseParams(req.params);
      if (await handler.isUserAuthorized()) {
        await handler.deleteRound();
        res.json({
          tournamentId: handler.getTournamentId(),
          roundId: handler.getRoundId()
        });
      } else {
        res.sendStatus(401);
      }
    } catch (e) {
      this._handleError(e, res);
    }
  }

  _handleError = (e: {[string]: mixed}, res: ServerApiResponse) => {
    if (e.status != null && typeof e.status === 'number') {
      res.sendStatus(e.status);
    } else {
      res.sendStatus(500);
    }
  }
}

class DeleteRoundRouteHandler {
  _user: UserModel;
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;

  _roundId: string;
  _tournamentId: string;

  constructor(user: UserModel, tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._user = user;
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  parseParams = (params: mixed) => {
    if (typeof params === 'object'
      && params != null
      && params.roundId != null
      && typeof params.roundId === 'string'
      && params.tournamentId != null
      && typeof params.tournamentId === 'string') {
      this._roundId = params.roundId;
      this._tournamentId = params.tournamentId;
    } else {
      throw {status: 400};
    }
  }

  getRoundId = () => {
    return this._roundId;
  }

  getTournamentId = () => {
    return this._tournamentId;
  }

  isUserAuthorized = async () => {
    const tournament =
      await this._tournamentRepository.get(this._tournamentId);

    if (tournament == null) {
      throw {status: 404};
    }
    return tournament.creatorId == this._user._id.toString();
  };

  deleteRound = async () => {
    this._roundRepository.delete(this._tournamentId, this._roundId);
  }

}

export default DeleteRoundRoute;

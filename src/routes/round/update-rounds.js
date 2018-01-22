// @flow

import type { UserModel } from '../../data/user';
import type { TournamentRepository } from '../../data/tournament';
import type { RoundRepository } from '../../data/round';

import validateRound from '../../validators/validate-round';
import parseRound from './utils';

class UpdateRoundsRoute {
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;

  constructor(tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new UpdateRoundsRouteHandler(
      req.session.user, this._tournamentRepository, this._roundRepository);

    try {
      handler.parseBody(req.body);
      if (await handler.isUserAuthorized()) {
        await handler.updateRounds();
        res.json(req.body);
      } else {
        throw {status: 401};
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

class UpdateRoundsRouteHandler {
  _user: UserModel;
  _tournamentRepository: TournamentRepository;
  _roundRepository: RoundRepository;

  _tournamentId: string;
  _rounds: Array<Round>;

  constructor(user: UserModel, tournamentRepository: TournamentRepository,
    roundRepository: RoundRepository) {
    this._user = user;
    this._tournamentRepository = tournamentRepository;
    this._roundRepository = roundRepository;
  }

  parseBody = (body: mixed) => {
    if (typeof body !== 'object'
      || body == null
      || body.tournamentId == null
      || typeof body.tournamentId !== 'string'
      || !Array.isArray(body.rounds)) {
      throw { status: 400 };
    }

    this._tournamentId = body.tournamentId;
    this._parseRounds(body.rounds);
  }

  _parseRounds = (rounds: Array<mixed>) => {
    this._rounds = rounds.map(r => parseRound(r));

    let areRoundsValid =
      this._rounds.reduce(
        (acc, r) => (acc && validateRound(r).isValidRound), true);

    if (!areRoundsValid) {
      throw { status: 400 };
    }
  };

  isUserAuthorized = async () => {
    const tournament =
      await this._tournamentRepository.get(this._tournamentId);

    if (tournament == null) {
      throw {status: 404};
    }

    return tournament.userId == this._user._id;
  };

  updateRounds = async () => {
    this._roundRepository.update(this._tournamentId, this._rounds);
  }

}

export default UpdateRoundsRoute;

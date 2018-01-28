// @flow

import ObjectId from 'bson-objectid';
import type { RoundRepository } from '../../data/round';
import validateRound from '../../validators/validate-round';
import type { TournamentRepository } from '../../data/tournament';
import type { UserModel } from '../../data/user';
import parseRound from './utils';

class CreateRoundRoute {
  _roundRepository: RoundRepository;
  _tournamentRepository: TournamentRepository;

  constructor(roundRepository: RoundRepository,
    tournamentRepository: TournamentRepository) {
    this._roundRepository = roundRepository;
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new CreateRoundRouteHandler(this._roundRepository,
      this._tournamentRepository);
    try {
      handler.parseBody(req.body);
      await handler.executeForUser(req.session.user);
      res.json({
        tournamentId: handler.getTournamentId(),
        round: handler.getCreatedRound()
      });
    } catch (e) {
      res.sendStatus(e.status);
    }
  }
}

class CreateRoundRouteHandler {
  _roundRepository: RoundRepository;
  _tournamentRepository: TournamentRepository;

  _tournamentId: string;
  _round: Round;
  _user: UserModel;

  constructor(roundRepository: RoundRepository,
    tournamentRepository: TournamentRepository) {
    this._roundRepository = roundRepository;
    this._tournamentRepository = tournamentRepository;
  }

  getTournamentId = () => {
    return this._tournamentId;
  }

  getCreatedRound = () => {
    return this._round;
  }

  async executeForUser(user: UserModel) {
    this._user = user;

    if (!await this._userOwnsTournament()) {
      throw { status: 401 };
    }

    await this._create();
  }

  _userOwnsTournament = async (): Promise<boolean> => {
    try {
      const tournament =
        await this._tournamentRepository.get(this._tournamentId);

      if (tournament == null) {
        throw { status: 404 };
      }

      return tournament.creatorId == this._user._id.toString();
    } catch (e) {
      if (e.status) throw e;
      throw { status: 500 };
    }
  }

  parseBody = (body: mixed) => {
    this._round = this._parseRound(body);
    this._tournamentId = this._parseTournamentId(body);

    if (!this._isValidRound()) {
      throw { status: 400 };
    }
  }

  _parseRound = (body: mixed) => {
    if (typeof body === 'object' && body != null) {
      return parseRound(body.round);
    } else {
      throw {status: 400};
    }
  }

  _parseTournamentId = (body: mixed) => {
    if (typeof body === 'object'
      && body != null && typeof body.tournamentId === 'string') {
      return body.tournamentId;
    } else {
      throw {status: 400};
    }
  };

  _isValidRound = () => {
    return validateRound(this._round).isValidRound;
  };

  _create = async () => {
    this._round._id = this._generateId();
    try {
      await this._roundRepository.create(this._tournamentId, this._round);
    } catch (e) {
      throw { status: 500 };
    }
  }

  _generateId = () => {
    return ObjectId.generate();
  }
}

export default CreateRoundRoute;

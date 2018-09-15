// @flow

import ObjectId from 'bson-objectid';
import validateRound from '../../validators/validate-round';
import type { TournamentRepository } from '../../data/tournament';
import parseRound from './utils';
import { createMalusCriterion } from '../util';

class CreateRoundRoute {
  _tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new CreateRoundRouteHandler(this._tournamentRepository);
    try {
      handler.parseBody(req.body);
      await handler.executeForUser(this._userId(req));
      res.json({
        tournamentId: handler.getTournamentId(),
        round: handler.getCreatedRound()
      });
    } catch (e) {
      res.sendStatus(e.status);
    }
  };

  _userId = (req: ServerApiRequest) => {
    return req.session.user != null ? req.session.user.id : '';
  };
}

class CreateRoundRouteHandler {
  _tournamentRepository: TournamentRepository;

  _tournamentId: string;
  _round: Round;
  _userId: string;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  getTournamentId = () => {
    return this._tournamentId;
  };

  getCreatedRound = () => {
    return this._round;
  };

  async executeForUser(userId: string) {
    this._userId = userId;

    const tournament = await this.getTournament();
    if (!this._userOwnsTournament(tournament)) {
      throw { status: 401 };
    }

    if (this._tournamentHasSanctioner(tournament)) {
      this._addMalusCriterion();
    }

    await this._create();
  }

  async getTournament(): Promise<Tournament> {
    const tournament = await this._tournamentRepository.get(this._tournamentId);

    if (tournament == null) {
      throw { status: 404 };
    }

    return tournament;
  }

  _userOwnsTournament = (tournament: Tournament): boolean => {
    return tournament.creatorId == this._userId;
  };

  _tournamentHasSanctioner = (tournament: Tournament): boolean => {
    return tournament.judges.some(({ type }) => type === 'sanctioner');
  };

  _addMalusCriterion = () => {
    this._round.criteria.push(createMalusCriterion());
  };

  parseBody = (body: mixed) => {
    this._round = this._parseRound(body);
    this._tournamentId = this._parseTournamentId(body);

    if (!this._isValidRound()) {
      throw { status: 400 };
    }
  };

  _parseRound = (body: mixed) => {
    if (typeof body === 'object' && body != null) {
      return parseRound(body.round);
    } else {
      throw { status: 400 };
    }
  };

  _parseTournamentId = (body: mixed) => {
    if (
      typeof body === 'object' &&
      body != null &&
      typeof body.tournamentId === 'string'
    ) {
      return body.tournamentId;
    } else {
      throw { status: 400 };
    }
  };

  _isValidRound = () => {
    return validateRound(this._round).isValidRound;
  };

  _create = async () => {
    this._round.id = this._generateId();
    try {
      await this._tournamentRepository.createRound(
        this._tournamentId,
        this._round
      );
    } catch (e) {
      throw { status: 500 };
    }
  };

  _generateId = () => {
    return ObjectId.generate().toString();
  };
}

export default CreateRoundRoute;

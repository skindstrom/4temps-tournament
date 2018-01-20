// @flow

import ObjectId from 'bson-objectid';
import validateRound from '../../validators/validate-round';
import type { TournamentModel } from '../../data/tournament';
import type { UserModel } from '../../data/user';

export type RoundDbModel = Round & { tournamentId: string };

export interface RoundRepository {
  create(round: RoundDbModel): void;
  getAll(): Array<RoundDbModel>;
}

export interface TournamentRepository {
  get(id: string): Promise<?TournamentModel>;
}

export interface ApiRequest {
  session: { user: UserModel };
  body: { [string]: mixed };
}

export interface ApiResponse {
  sendStatus(statusCode: number): ApiResponse;
  json(body?: mixed): ApiResponse;
}

export class CreateRoundRoute {
  _roundRepository: RoundRepository;
  _tournamentRepository: TournamentRepository;

  constructor(roundRepository: RoundRepository,
    tournamentRepository: TournamentRepository) {
    this._roundRepository = roundRepository;
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ApiRequest, res: ApiResponse) => {
    const handler = new CreateRoundRouteHandler(this._roundRepository,
      this._tournamentRepository);
    try {
      handler.parseBody(req.body);
      await handler.executeForUser(req.session.user);
      res.json(handler._round);
    } catch (e) {
      res.sendStatus(e.status);
    }
  }
}

class CreateRoundRouteHandler {
  _roundRepository: RoundRepository;
  _tournamentRepository: TournamentRepository;

  _round: RoundDbModel;
  _user: UserModel;

  constructor(roundRepository: RoundRepository,
    tournamentRepository: TournamentRepository) {
    this._roundRepository = roundRepository;
    this._tournamentRepository = tournamentRepository;
  }

  async executeForUser(user: UserModel) {
    this._user = user;

    if (!await this._userOwnsTournament()) {
      throw { status: 401 };
    }

    this._create();
  }

  _userOwnsTournament = async (): Promise<boolean> => {
    try {
      const tournament =
        await this._tournamentRepository.get(this._round.tournamentId);

      if (tournament == null) {
        throw { status: 404 };
      }

      return tournament.userId == this._user._id;
    } catch (e) {
      if (e.status) throw e;
      throw { status: 500 };
    }
  }

  // $FlowFixMe
  parseBody = (body: any) => {
    const round = {
      _id: '',
      danceCount: null,
      minPairCount: null,
      maxPairCount: null,
      tieRule: 'none',
      roundScoringRule: 'none',
      multipleDanceScoringRule: 'none',
      tournamentId: body.tournamentId || '',
      criteria: [],
    };

    for (const key in body.round) {
      if (key in round && body.round[key] != undefined) {
        round[key] = body.round[key];
      }
    }

    this._round = round;

    if (!this._isValidRound()) {
      throw { status: 400 };
    }
  }

  _isValidRound = () => {
    return validateRound(this._round).isValidRound;
  };

  _create = () => {
    this._round._id = this._generateId();
    try {
      this._roundRepository.create(this._round);
    } catch (e) {
      throw { status: 500 };
    }
  }

  _generateId = () => {
    return ObjectId.generate();
  }
}

export default CreateRoundRoute;
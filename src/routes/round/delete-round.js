// @flow

import type { TournamentRepository } from '../../data/tournament';

class DeleteRoundRoute {
  _tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    const handler = new DeleteRoundRouteHandler(
      this._userId(req),
      this._tournamentRepository
    );

    try {
      handler.parseParams(req.params);
      if (
        (await handler.isUserAuthorized()) &&
        !(await handler.isRoundStartedOrFinished())
      ) {
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
  };

  _userId = (req: ServerApiRequest) => {
    return req.session.user != null ? req.session.user.id : '';
  };

  _handleError = (e: { [string]: mixed }, res: ServerApiResponse) => {
    if (e.status != null && typeof e.status === 'number') {
      res.sendStatus(e.status);
    } else {
      res.sendStatus(500);
    }
  };
}

class DeleteRoundRouteHandler {
  _userId: string;
  _tournamentRepository: TournamentRepository;

  _roundId: string;
  _tournamentId: string;

  constructor(userId: string, tournamentRepository: TournamentRepository) {
    this._userId = userId;
    this._tournamentRepository = tournamentRepository;
  }

  parseParams = (params: mixed) => {
    if (
      typeof params === 'object' &&
      params != null &&
      params.roundId != null &&
      typeof params.roundId === 'string' &&
      params.tournamentId != null &&
      typeof params.tournamentId === 'string'
    ) {
      this._roundId = params.roundId;
      this._tournamentId = params.tournamentId;
    } else {
      throw { status: 400 };
    }
  };

  getRoundId = () => {
    return this._roundId;
  };

  getTournamentId = () => {
    return this._tournamentId;
  };

  isUserAuthorized = async () => {
    const tournament = await this._tournamentRepository.get(this._tournamentId);

    if (tournament == null) {
      throw { status: 404 };
    }
    return tournament.creatorId == this._userId;
  };

  deleteRound = async () => {
    this._tournamentRepository.deleteRound(this._tournamentId, this._roundId);
  };

  isRoundStartedOrFinished = async () => {
    const tournament = await this._tournamentRepository.get(this._tournamentId);

    if (tournament == null) {
      throw { status: 404 };
    }

    for (const round of tournament.rounds) {
      if (round.id === this._roundId) {
        return round.active || round.finished;
      }
    }

    throw { status: 404 };
  };
}

export default DeleteRoundRoute;

// @flow

import type { TournamentRepository } from '../../data/tournament';

export default class StartDanceRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const handler = new StartDanceRouteHandler(
        this._repository,
        tournamentId
      );

      await handler.startDance();
      res.json(handler.getUpdatedRound());
    } catch (e) {
      res.status(this._statusFromError(e));
    }
  };

  _statusFromError = (e: mixed) => {
    if (e instanceof NoNextDanceError || e instanceof TournamentNotFoundError) {
      return 404;
    }
    return 500;
  };
}

class StartDanceRouteHandler {
  _repository: TournamentRepository;
  _tournamentId: string;

  _tournament: Tournament;
  _round: Round;

  constructor(repository: TournamentRepository, tournamentId: string) {
    this._repository = repository;
    this._tournamentId = tournamentId;
  }

  getUpdatedRound = () => {
    return this._round;
  };

  startDance = async () => {
    const tournament = await this._repository.get(this._tournamentId);

    if (!tournament) {
      throw new TournamentNotFoundError();
    }

    this._round = this._getActiveRound(tournament);
    this._startNextDance();

    await this._repository.updateRound(this._tournamentId, this._round);
  };

  _getActiveRound = (tournament: Tournament): Round => {
    for (const round of tournament.rounds) {
      if (round.active) {
        return round;
      }
    }

    throw new NoNextDanceError();
  };

  _startNextDance = (): void => {
    for (let i = 0; i < this._round.groups.length; ++i) {
      for (let j = 0; j < this._round.groups[i].dances.length; ++j) {
        if (!this._round.groups[i].dances[j].finished) {
          this._round.groups[i].dances[j].active = true;
          return;
        }
      }
    }

    throw new NoNextDanceError();
  };
}

function TournamentNotFoundError() {}
function NoNextDanceError() {}

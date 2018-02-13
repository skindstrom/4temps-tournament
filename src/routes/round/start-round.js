// @flow
import type { TournamentRepository } from '../../data/tournament';

export default class StartRoundRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const handler = new StartRoundRouteHandler(
        this._repository,
        tournamentId,
        req.params.roundId
      );

      await handler.startRound();
      res.json(handler.getUpdatedRound());
    } catch (e) {
      res.status(this._statusFromError(e));
    }
  };

  _statusFromError = (e: mixed) => {
    if (
      e instanceof RoundNotFoundError ||
      e instanceof TournamentNotFoundError
    ) {
      return 404;
    } else if (
      e instanceof AlreadyStartedError ||
      e instanceof AlreadyFinishedError
    ) {
      return 400;
    }
    return 500;
  };
}

class StartRoundRouteHandler {
  _repository: TournamentRepository;
  _tournamentId: string;
  _roundId: string;

  _tournament: Tournament;
  _round: Round;

  constructor(
    repository: TournamentRepository,
    tournamentId: string,
    roundId: string
  ) {
    this._repository = repository;
    this._tournamentId = tournamentId;
    this._roundId = roundId;
  }

  getUpdatedRound = () => {
    return this._round;
  };

  startRound = async () => {
    this._tournament = await this._getTournament();
    this._round = this._getRound();

    if (this._round.active) {
      throw new AlreadyStartedError();
    } else if (this._round.finished) {
      throw new AlreadyFinishedError();
    }

    this._round.active = true;

    await this._repository.updateRound(this._tournamentId, this._round);
  };

  _getTournament = async (): Promise<Tournament> => {
    const tournament = await this._repository.get(this._tournamentId);
    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament;
  };

  _getRound = (): Round => {
    const matches = this._tournament.rounds.filter(
      ({ id }) => id === this._roundId
    );

    if (matches.length === 0) {
      throw new RoundNotFoundError();
    }

    return matches[0];
  };
}

function TournamentNotFoundError() {}
function RoundNotFoundError() {}
function AlreadyStartedError() {}
function AlreadyFinishedError() {}

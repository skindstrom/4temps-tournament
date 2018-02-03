// @flow
import type {TournamentRepository} from '../../data/tournament';
import PairingGeneratorImpl from '../../domain/group-pairing-generator';

export default class StartRoundRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  async route(req: ServerApiRequest, res: ServerApiResponse) {
    try {
      const handler =
        new StartRoundRouteHandler(
          this._repository, req.params.tournamentId, req.params.roundId);

      await handler.startRound();
      res.json(await this._repository.get(req.params.tournamentId));
    } catch (e) {
      res.status(this._statusFromError(e));
    }
  }

  _statusFromError = (e: mixed) => {
    if (e instanceof RoundNotFoundError) {
      return 404;
    }
    return 500;
  }
}

class StartRoundRouteHandler {
  _repository: TournamentRepository;
  _tournamentId: string;
  _roundId: string;

  _tournament: Tournament;
  _round: Round;

  constructor(
    repository: TournamentRepository, tournamentId: string, roundId: string) {
    this._repository = repository;
    this._tournamentId = tournamentId;
    this._roundId = roundId;
  }

  startRound = async () => {
    this._tournament = await this._repository.get(this._tournamentId);

    const round = this._getRound();
    round.groups = this._generateGroups();
    round.active = true;
    await this._repository.updateRound(this._tournamentId, round);
  }

  _generateGroups = (): Array<DanceGroup> => {
    const generator =
      new PairingGeneratorImpl(
        this._getRound(), this._tournament.participants);

    return generator.generateGroups().map(pairs => ({pairs}));
  }

  _getRound = (): Round => {
    const matches = this._tournament.rounds.filter(
      ({_id}) => _id === this._roundId);

    if (matches.length === 0) {
      throw new RoundNotFoundError;
    }

    return matches[0];
  }
}

function RoundNotFoundError(){}

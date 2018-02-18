// @flow
import ObjectId from 'bson-objectid';
import type { TournamentRepository } from '../../data/tournament';
import PairingGeneratorImpl from '../../domain/group-pairing-generator';

export default class GenerateGroupsRoute {
  _repository: TournamentRepository;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const handler = new GenerateGroupsRouteHandler(
        this._repository,
        tournamentId,
        req.params.roundId
      );

      await handler.startRound();
      res.json(handler.getUpdatedRound());
    } catch (e) {
      res.sendStatus(this._statusFromError(e));
    }
  };

  _statusFromError = (e: mixed) => {
    if (
      e instanceof RoundNotFoundError ||
      e instanceof TournamentNotFoundError
    ) {
      return 404;
    } else if (
      e instanceof DanceStartedError ||
      e instanceof NotStartedError ||
      e instanceof AlreadyFinishedError
    ) {
      return 400;
    }
    return 500;
  };
}

class GenerateGroupsRouteHandler {
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

    if (!this._round.active) {
      throw new NotStartedError();
    } else if (this._hasActiveOrFinishedDance()) {
      throw new DanceStartedError();
    } else if (this._round.finished) {
      throw new AlreadyFinishedError();
    }

    const groups = this._generateGroups();
    this._addGroupsToRound(groups);

    await this._repository.updateRound(this._tournamentId, this._round);
  };

  _addGroupsToRound = (groups: Array<DanceGroup>) => {
    this._round.groups = [];
    if (groups.length >= 1) {
      this._round.groups.push(groups[0]);
    }
    if (groups.length >= 2) {
      this._round.groups.push(groups[1]);
    }
  };

  _generateGroups = (): Array<DanceGroup> => {
    const generator = new PairingGeneratorImpl(
      this._getRound(),
      this._getParticipants()
    );

    return generator.generateGroups().map(pairs => ({
      id: ObjectId.generate(),
      pairs,
      dances: this._createDances(this._round.danceCount)
    }));
  };

  _createDances = (danceCount: number) => {
    let dances: Array<Dance> = [];
    for (let i = 0; i < danceCount; ++i) {
      dances.push({ id: ObjectId.generate(), active: false, finished: false });
    }
    return dances;
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

  _hasActiveOrFinishedDance = (): boolean => {
    return this._round.groups.reduce(
      (acc, group) =>
        acc ||
        group.dances.reduce(
          (acc, dance) => acc || dance.active || dance.finished,
          false
        ),
      false
    );
  };

  _getParticipants = (): Array<Participant> => {
    if (this._hasPreviousRound()) {
      return this._getWinnersOfPreviousRound();
    }
    return this._tournament.participants;
  };

  _hasPreviousRound = () => {
    return this._tournament.rounds[0].id !== this._round.id;
  };

  _getWinnersOfPreviousRound = (): Array<Participant> => {
    let prevRound: ?Round = null;
    for (const round of this._tournament.rounds) {
      if (round.id === this._round.id && prevRound != null) {
        return [
          ...prevRound.winners.leaders,
          ...prevRound.winners.followers
          // $FlowFixMe
        ].map(id => this._tournament.participants.find(p => p.id === id));
      }
      prevRound = round;
    }
    throw new RoundNotFoundError();
  };
}

function TournamentNotFoundError() {}
function RoundNotFoundError() {}
function NotStartedError() {}
function DanceStartedError() {}
function AlreadyFinishedError() {}

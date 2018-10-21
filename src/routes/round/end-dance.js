// @flow

import NoteChecker from '../../domain/note-checker';
import RoundScorer from '../../domain/round-scorer';
import NextGroupGenerator from '../../domain/next-group-generator';
import type { TournamentRepository } from '../../data/tournament';
import type { NoteRepository } from '../../data/note';
import createLeaderboard from '../leaderboard/create-leaderboard';
import isDrawInRound from '../../domain/is-draw-in-round';

type UpdateLeaderboardFunc = (leaderboard: Leaderboard) => void;

export default class StartDanceRoute {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;
  _updateLeaderboardFunc: UpdateLeaderboardFunc;

  constructor(
    repository: TournamentRepository,
    noteRepository: NoteRepository,
    updateLeaderboard: UpdateLeaderboardFunc
  ) {
    this._tournamentRepository = repository;
    this._noteRepository = noteRepository;
    this._updateLeaderboardFunc = updateLeaderboard;
  }

  route = () => async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const handler = new EndDanceRouteHandler(
        this._tournamentRepository,
        this._noteRepository,
        this._updateLeaderboardFunc,
        tournamentId
      );

      await handler.endDance();
      res.json(handler.getUpdatedRound());
    } catch (e) {
      this._handleError(e, res);
    }
  };

  _handleError = (e: mixed, res: ServerApiResponse) => {
    if (e instanceof TournamentNotFoundError) {
      res.sendStatus(404);
    }
    if (e instanceof NoStartedDanceError) {
      res.status(404);
      res.json({ hasActiveDance: false });
    } else if (e instanceof NotAllNotesError) {
      res.status(400);
      res.json({ isAllSubmitted: false });
    } else if (e instanceof RoundHasDrawError) {
      res.status(409);
      res.json({ isDraw: true });
    } else {
      res.sendStatus(500);
    }
  };
}

class EndDanceRouteHandler {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;
  _updateLeaderboardFunc: UpdateLeaderboardFunc;
  _tournamentId: string;

  _tournament: Tournament;
  _round: Round;

  constructor(
    repository: TournamentRepository,
    noteRepository: NoteRepository,
    updateLeaderboard: UpdateLeaderboardFunc,
    tournamentId: string
  ) {
    this._tournamentRepository = repository;
    this._noteRepository = noteRepository;

    this._updateLeaderboardFunc = updateLeaderboard;
    this._tournamentId = tournamentId;
  }

  getUpdatedRound = () => {
    return this._round;
  };

  endDance = async () => {
    const tournament = await this._tournamentRepository.get(this._tournamentId);

    if (!tournament) {
      throw new TournamentNotFoundError();
    }

    const round = this._getActiveRound(tournament);
    if (round.draw) {
      throw new RoundHasDrawError();
    }

    const dance = this._getStartedDance(round);

    if (!(await this._hasAllNotesForDance(tournament, dance))) {
      throw new NotAllNotesError();
    }

    if (
      this._isLastDanceInGroup(round, dance) &&
      this._isLastGroup(round, dance)
    ) {
      await this._generateNextGroups(tournament, round);
      // if it's still the last after having generated a new one, it's the very last
      if (this._isLastGroup(round, dance)) {
        await this._endRoundOfTournament(tournament, round);
      }
    }

    dance.active = false;
    dance.finished = true;

    await this._tournamentRepository.updateRound(this._tournamentId, round);

    this._round = round;

    if (this._round.finished) {
      this._updateLeaderboardFunc(createLeaderboard(tournament));
    }
  };

  _getActiveRound = (tournament: Tournament): Round => {
    for (const round of tournament.rounds) {
      if (round.active) {
        return round;
      }
    }

    throw new NoStartedDanceError();
  };

  _getStartedDance = (round: Round): Dance => {
    for (let i = 0; i < round.groups.length; ++i) {
      for (let j = 0; j < round.groups[i].dances.length; ++j) {
        if (round.groups[i].dances[j].active) {
          return round.groups[i].dances[j];
        }
      }
    }

    throw new NoStartedDanceError();
  };

  _hasAllNotesForDance = async (
    tournament: Tournament,
    dance: Dance
  ): Promise<boolean> => {
    const checker = new NoteChecker(tournament);
    const notes = await this._noteRepository.getForDance(dance.id);
    return checker.allSetForDance(dance.id, notes);
  };

  _isLastDanceInGroup = (round: Round, activeDance: Dance): boolean => {
    for (let i = 0; i < round.groups.length; ++i) {
      for (let j = 0; j < round.groups[i].dances.length; ++j) {
        if (round.groups[i].dances[j].id === activeDance.id) {
          return j === round.groups[i].dances.length - 1;
        }
      }
    }
    throw new NoStartedDanceError();
  };

  _isLastGroup = (round: Round, activeDance: Dance): boolean => {
    for (let i = 0; i < round.groups.length; ++i) {
      for (let j = 0; j < round.groups[i].dances.length; ++j) {
        if (round.groups[i].dances[j].id === activeDance.id) {
          return i === round.groups.length - 1;
        }
      }
    }

    throw new NoStartedDanceError();
  };

  _generateNextGroups = async (
    tournament: Tournament,
    round: Round
  ): Promise<void> => {
    const generator = new NextGroupGenerator(
      tournament,
      await this._getNotes(round)
    );

    let group = null;
    do {
      group = generator.generateForRound(round.id);
      if (group != null) {
        round.groups.push(group);
      }
    } while (group != null);
  };

  _endRoundOfTournament = async (tournament: Tournament, round: Round) => {
    const notes = await this._getNotes(round);

    round.roundScores = new RoundScorer(tournament.judges, round).scoreRound(
      notes
    );

    if (this._hasDraw(round)) {
      round.draw = true;
      round.roundScores = new RoundScorer(tournament.judges, round, {
        countPresident: true
      }).scoreRound(notes);
    } else {
      round.active = false;
      round.finished = true;
    }
  };

  _hasDraw = (round: Round): boolean => isDrawInRound(round);

  _getNotes = async (round: Round) => {
    let notes: Array<JudgeNote> = [];
    for (const group of round.groups) {
      for (const dance of group.dances) {
        notes = notes.concat(await this._noteRepository.getForDance(dance.id));
      }
    }
    return notes;
  };
}

function TournamentNotFoundError() {}
function NoStartedDanceError() {}
function NotAllNotesError() {}
function RoundHasDrawError() {}

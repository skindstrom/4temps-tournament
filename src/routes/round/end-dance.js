// @flow

import ObjectId from 'bson-objectid';
import NoteChecker from '../../domain/note-checker';
import GroupGeneratorImpl from '../../domain/group-pairing-generator';
import RoundScorer from '../../domain/round-scorer';
import WinnerPicker from '../../domain/winner-picker';
import type { TournamentRepository } from '../../data/tournament';
import type { NoteRepository } from '../../data/note';

export default class StartDanceRoute {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;

  constructor(
    repository: TournamentRepository,
    noteRepository: NoteRepository
  ) {
    this._tournamentRepository = repository;
    this._noteRepository = noteRepository;
  }

  route = () => async (req: ServerApiRequest, res: ServerApiResponse) => {
    try {
      const tournamentId = req.params.tournamentId;
      const handler = new StartDanceRouteHandler(
        this._tournamentRepository,
        this._noteRepository,
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
    } else {
      res.sendStatus(500);
    }
  };
}

class StartDanceRouteHandler {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;
  _tournamentId: string;

  _tournament: Tournament;
  _round: Round;

  constructor(
    repository: TournamentRepository,
    noteRepository: NoteRepository,
    tournamentId: string
  ) {
    this._tournamentRepository = repository;
    this._noteRepository = noteRepository;
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
    const dance = this._getStartedDance(round);

    if (!await this._hasAllNotesForDance(tournament, dance)) {
      throw new NotAllNotesError();
    }

    if (this._isLastDanceInGroup(round, dance)) {
      await this._generateNextGroup(tournament, round);
      // if it's still the last after having generated a new one, it's the very last
      if (this._isLastDanceInGroup(round, dance)) {
        await this._endRound(round);
      }
    }

    dance.active = false;
    dance.finished = true;

    await this._tournamentRepository.updateRound(this._tournamentId, round);

    this._round = round;
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
    const group = round.groups[round.groups.length - 1];
    const index = group.dances.findIndex(dance => dance.id === activeDance.id);
    return index === group.dances.length - 1;
  };

  _generateNextGroup = async (
    tournament: Tournament,
    round: Round
  ): Promise<void> => {
    const participants = tournament.participants;
    const alreadyDanceParticipants = new Set(
      this._getAlreadyDancedParticipants(round)
    );

    const remainingParticipants = participants.filter(
      ({ id }) => !alreadyDanceParticipants.has(id)
    );

    if (remainingParticipants.length === 0) {
      return;
    }

    let pairs = new GroupGeneratorImpl(
      round,
      remainingParticipants
    ).generateGroups()[0];

    const isUneven = pairs.reduce(
      (acc, pair) => acc || pair.follower == null || pair.leader == null,
      false
    );

    if (isUneven) {
      const wantsLeader = pairs.reduce(
        (acc, pair) => acc || pair.leader == null,
        false
      );

      if (wantsLeader) {
        remainingParticipants.push(
          await this._getLeaderWithWorstFollower(tournament, round)
        );
      } else {
        remainingParticipants.push(
          await this._getFollowerWithWorstLeader(tournament, round)
        );
      }
      pairs = new GroupGeneratorImpl(
        round,
        remainingParticipants
      ).generateGroups()[0];
    }

    const dances: Array<Dance> = [];
    for (let i = 0; i < round.danceCount; ++i) {
      dances.push({ id: ObjectId.generate(), active: false, finished: false });
    }

    round.groups.push({
      id: ObjectId.generate(),
      pairs,
      dances
    });
  };

  _getAlreadyDancedParticipants = (round: Round): Array<string> => {
    // $FlowFixMe
    return round.groups.reduce(
      (participants, group) => [
        ...participants,
        ...group.pairs
          .map(pair => [pair.follower, pair.leader])
          .reduce((acc, ids) => [...acc, ...ids], [])
          .filter(id => id != null)
      ],
      []
    );
  };

  _getLeaderWithWorstFollower = async (
    tournament: Tournament,
    round: Round
  ): Promise<Participant> => {
    const followers = new Set(
      round.groups.reduce(
        (participants, group) => [
          ...participants,
          ...group.pairs
            .map(pair => [pair.follower])
            .reduce((acc, ids) => [...acc, ...ids], [])
            .filter(id => id != null)
        ],
        []
      )
    );

    const scorer = new RoundScorer(round);
    const scores = scorer.scoreRound(await this._getNotes(round));

    const worstFollower = scores
      .reverse()
      .filter(score => followers.has(score.participantId))[0].participantId;

    for (const group of round.groups) {
      const pair = group.pairs.find(pair => pair.follower === worstFollower);
      if (pair != null) {
        for (const participant of tournament.participants) {
          if (participant.id === pair.leader) {
            return participant;
          }
        }
      }
    }
    throw new NoParticipantError();
  };

  _getFollowerWithWorstLeader = async (
    tournament: Tournament,
    round: Round
  ): Promise<Participant> => {
    const leaders = new Set(
      round.groups.reduce(
        (participants, group) => [
          ...participants,
          ...group.pairs
            .map(pair => [pair.leader])
            .reduce((acc, ids) => [...acc, ...ids], [])
            .filter(id => id != null)
        ],
        []
      )
    );

    const scorer = new RoundScorer(round);
    const scores = scorer.scoreRound(await this._getNotes(round));

    const worstLeader = scores
      .reverse()
      .filter(score => leaders.has(score.participantId))[0].participantId;

    for (const group of round.groups) {
      const pair = group.pairs.find(pair => pair.leader === worstLeader);
      if (pair != null) {
        for (const participant of tournament.participants) {
          if (participant.id === pair.follower) {
            return participant;
          }
        }
      }
    }
    throw new NoParticipantError();
  };

  _endRound = async (round: Round) => {
    const notes = await this._getNotes(round);

    round.scores = new RoundScorer(round).scoreRound(notes);
    round.winners = new WinnerPicker(round).pickWinners(notes);

    round.active = false;
    round.finished = true;
  };

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
function NoParticipantError() {}

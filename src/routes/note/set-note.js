// @flow
import type { TournamentRepository } from '../../data/tournament';
import type { NoteRepository } from '../../data/note';
import type { Tournament } from '../../models/tournament';
import type { Participant } from '../../models/participant';

export default function CreateNoteRoute(
  tournamentRepository: TournamentRepository, noteRepository: NoteRepository) {

  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    await new CreateNoteRouteHandler(
      tournamentRepository, noteRepository, req, res).route();
  };
}

class CreateNoteRouteHandler {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;
  _req: ServerApiRequest;
  _res: ServerApiResponse;

  constructor(
    tournamentRepository: TournamentRepository,
    noteRepository: NoteRepository,
    req: ServerApiRequest,
    res: ServerApiResponse) {
    this._tournamentRepository = tournamentRepository;
    this._noteRepository = noteRepository;
    this._req = req;
    this._res = res;
  }

  route = async () => {
    try {
      const note = this._parseBody();

      await this._validateNote(note);
      await this._noteRepository.createOrUpdate(note);

      this._res.json(note);
    } catch (e) {
      this._handleError(e);
    }
  }

  _validateNote = async (note: JudgeNote) => {
    if (this._req.session.user == null
      || note.judgeId != this._req.session.user.id) {
      throw new WrongJudgeError();
    }

    const tournament: Tournament = await this._getTournament();
    if (!this._isDanceActive(tournament, note.danceId)) {
      throw new DanceNotActiveError();
    }

    const criterion = this._getCriterion(tournament, note.criterionId);
    const participant = this._getParticipant(tournament, note.participantId);

    if (!this._isValidCriterionForParticipant(criterion, participant)) {
      throw new InvalidCriterionForParticipant();
    }

    if (!this._isValueWithinRange(criterion, note.value)) {
      throw new InvalidValueError();
    }
  }

  _parseBody = (): JudgeNote => {
    const body = this._req.body;
    if (
      typeof body === 'object'
      && body != null
      && typeof body.judgeId === 'string'
      && body.judgeId != null
      && typeof body.danceId === 'string'
      && body.danceId != null
      && typeof body.criterionId === 'string'
      && body.criterionId != null
      && typeof body.participantId === 'string'
      && body.participantId != null
      && typeof body.value === 'number'
      && Number.isInteger(body.value)
      && body.value != null
    ) {
      const note: JudgeNote = {
        judgeId: body.judgeId,
        danceId: body.danceId,
        criterionId: body.criterionId,
        participantId: body.participantId,
        value: body.value
      };
      return note;
    }
    throw new InvalidBodyError();
  }

  _getTournament = async (): Promise<Tournament> => {
    const tournament =
      await this._tournamentRepository.get(this._req.params.tournamentId);

    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament;
  }

  _isDanceActive = (tournament: Tournament, danceId: string): boolean => {
    for (const round of tournament.rounds) {
      for (const group of round.groups) {
        for (const dance of group.dances) {
          if (dance.id === danceId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  _getCriterion =
    (tournament: Tournament, criterionId: string): RoundCriterion => {
      for (const round of tournament.rounds) {
        for (const criterion of round.criteria) {
          if (criterion.id === criterionId) {
            return criterion;
          }
        }
      }
      throw new CriterionNotFoundError();
    }
  _getParticipant =
    (tournament: Tournament, participantId: string): Participant => {
      for (const participant of tournament.participants) {
        if (participant.id === participantId) {
          return participant;
        }
      }
      throw new ParticipantNotFoundError();
    }

  _isValidCriterionForParticipant =
    (criterion: RoundCriterion, participant: Participant): boolean => {
      if (criterion.type === 'leader') {
        return participant.role === 'leader'
          || participant.role === 'leaderAndFollower';
      } else if (criterion.type === 'follower') {
        return participant.role === 'follower'
          || participant.role === 'leaderAndFollower';
      }

      return true;
    }

  _isValueWithinRange = (criterion: RoundCriterion, value: number) => {
    return criterion.minValue <= value && value <= criterion.maxValue;
  }

  _handleError = (e: mixed) => {
    if (e instanceof InvalidBodyError) {
      this._res.sendStatus(400);
    } else if (e instanceof TournamentNotFoundError) {
      this._res.status(404);
      this._res.json({ tournamentExists: false });
    } else if (e instanceof DanceNotActiveError) {
      this._res.status(404);
      this._res.json({ isDanceActive: false });
    } else if (e instanceof CriterionNotFoundError) {
      this._res.status(404);
      this._res.json({ criterionExists: false });
    } else if (e instanceof ParticipantNotFoundError) {
      this._res.status(404);
      this._res.json({ participantExists: false });
    } else if (e instanceof InvalidCriterionForParticipant) {
      this._res.status(400);
      this._res.json({ isValidCriterionForParticipant: false });
    } else if (e instanceof InvalidValueError) {
      this._res.status(400);
      this._res.json({ isValueInRange: false });
    } else if (e instanceof WrongJudgeError) {
      this._res.sendStatus(401);
    } else {
      // eslint-disable-next-line
      console.error(e);
      this._res.status(500);
    }
  }
}

function InvalidBodyError(){}
function TournamentNotFoundError(){}
function DanceNotActiveError(){}
function CriterionNotFoundError(){}
function ParticipantNotFoundError(){}
function InvalidCriterionForParticipant(){}
function InvalidValueError(){}
function WrongJudgeError(){}
// @flow
import type { TournamentRepository } from '../../data/tournament';
import type { NoteRepository } from '../../data/note';
import validateNoteForTournamentAndUser, {
  DanceNotActiveError,
  CriterionNotFoundError,
  ParticipantNotFoundError,
  InvalidCriterionForParticipant,
  InvalidValueError,
  WrongJudgeError
} from './validate-note';
import { parseNotes, InvalidBodyError } from './parse-note';

export default function submitNotesRoute(
  tournamentRepository: TournamentRepository,
  noteRepository: NoteRepository
) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    await new SubmitNotesRouteHandler(
      tournamentRepository,
      noteRepository,
      req,
      res
    ).route();
  };
}

class SubmitNotesRouteHandler {
  _tournamentRepository: TournamentRepository;
  _noteRepository: NoteRepository;
  _req: ServerApiRequest;
  _res: ServerApiResponse;

  constructor(
    tournamentRepository: TournamentRepository,
    noteRepository: NoteRepository,
    req: ServerApiRequest,
    res: ServerApiResponse
  ) {
    this._tournamentRepository = tournamentRepository;
    this._noteRepository = noteRepository;
    this._req = req;
    this._res = res;
  }

  route = async () => {
    try {
      const notes = parseNotes(this._req.body);
      await this._validateNotes(notes);

      const danceId = notes[0].danceId;

      if (await this._hasPreviouslySubmitted(danceId)) {
        this._res.sendStatus(400);
      } else {
        await this._tournamentRepository.markDanceAsNoted(
          this._req.params.tournamentId,
          // $FlowFixMe
          this._req.session.user.id,
          danceId
        );

        for (const note of notes) {
          await this._noteRepository.createOrUpdate(note);
        }
        this._res.sendStatus(200);
      }
    } catch (e) {
      this._handleError(e);
    }
  };

  _validateNotes = async (notes: Array<JudgeNote>) => {
    const tournament: Tournament = await this._getTournament();
    notes.forEach(note =>
      validateNoteForTournamentAndUser(note, tournament, this._req.session.user)
    );
  };

  _hasPreviouslySubmitted = async (danceId: string) => {
    // $FlowFixMe
    const userId = this._req.session.user.id;
    const tournament = await this._getTournament();
    if (tournament.dancesNoted && tournament.dancesNoted[userId]) {
      return tournament.dancesNoted[userId].includes(danceId);
    }

    return false;
  };

  _getTournament = async (): Promise<Tournament> => {
    const tournament = await this._tournamentRepository.get(
      this._req.params.tournamentId
    );

    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament;
  };

  _handleError = (e: mixed) => {
    if (e instanceof InvalidBodyError) {
      this._res.sendStatus(400);
    } else if (
      e instanceof TournamentNotFoundError ||
      e instanceof DanceNotActiveError ||
      e instanceof CriterionNotFoundError ||
      e instanceof ParticipantNotFoundError
    ) {
      this._res.status(404);
    } else if (
      e instanceof InvalidCriterionForParticipant ||
      e instanceof InvalidValueError
    ) {
      this._res.status(400);
    } else if (e instanceof WrongJudgeError) {
      this._res.sendStatus(401);
    } else {
      this._res.status(500);
    }
  };
}

function TournamentNotFoundError() {}

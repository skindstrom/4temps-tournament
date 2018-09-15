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
import { parseNote, InvalidBodyError } from './parse-note';

export default function CreateNoteRoute(
  tournamentRepository: TournamentRepository,
  noteRepository: NoteRepository
) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    await new CreateNoteRouteHandler(
      tournamentRepository,
      noteRepository,
      req,
      res
    ).route();
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
    res: ServerApiResponse
  ) {
    this._tournamentRepository = tournamentRepository;
    this._noteRepository = noteRepository;
    this._req = req;
    this._res = res;
  }

  route = async () => {
    try {
      const note = parseNote(this._req.body);

      await this._validateNote(note);
      await this._noteRepository.createOrUpdate(note);

      this._res.json(note);
    } catch (e) {
      this._handleError(e);
    }
  };

  _validateNote = async (note: JudgeNote) => {
    const tournament: Tournament = await this._getTournament();
    const judge: ?Judge = tournament.judges.find(
      judge =>
        judge.id === (this._req.session.user && this._req.session.user.id)
    );
    validateNoteForTournamentAndUser(note, tournament, judge);
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
      this._res.status(500);
    }
  };
}

function TournamentNotFoundError() {}

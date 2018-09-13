// @flow
import setNoteRoute from '../set-note';
import {
  TournamentRepositoryImpl,
  Request,
  Response,
  generateId,
  createTournament,
  createRound,
  createJudge,
  createParticipant,
  NoteRepositoryImpl,
  createCriterion
} from '../../../test-utils';

describe('Create note route', () => {
  const judge = createJudge();
  const participant = {
    ...createParticipant(),
    role: 'leader'
  };
  const dance = { id: generateId(), active: true, finished: false };

  const criterion: RoundCriterion = createCriterion();

  const validNote: JudgeNote = {
    judgeId: judge.id,
    danceId: dance.id,
    criterionId: criterion.id,
    participantId: participant.id,
    value: 1
  };

  const hydratedTournament: Tournament = {
    ...createTournament(),
    participants: [participant],
    judges: [judge],
    rounds: [
      {
        ...createRound(),
        criteria: [criterion],
        groups: [
          {
            id: generateId(),
            pairs: [],
            dances: [dance]
          }
        ]
      }
    ]
  };

  test('404 is returned if the tournament does not exist', async () => {
    const req = Request.withJudgeAndParams(judge, {
      tournamentId: generateId()
    });
    req.body = validNote;
    const res = new Response();

    await setNoteRoute(
      new TournamentRepositoryImpl(),
      new NoteRepositoryImpl()
    )(req, res);

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ tournamentExists: false });
  });

  test('401 is returned if the judge on the note is not the one logged in', async () => {
    const tournament = createTournament();
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(tournament);

    const req = Request.withJudgeAndParams(createJudge(), {
      tournamentId: tournament.id
    });

    req.body = validNote;
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(401);
  });

  test('404 is returned if there is no active dance', async () => {
    const tournament = createTournament();
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(tournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: tournament.id
    });
    req.body = validNote;
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ isDanceActive: false });
  });

  test('404 is returned if there is no such criterion', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });

    req.body = { ...validNote, criterionId: generateId() };
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ criterionExists: false });
  });

  test('404 is returned if there is no such participant', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = { ...validNote, participantId: generateId() };
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ participantExists: false });
  });

  test('400 is returned if the value is not within range', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = { ...validNote, value: 100 };
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(400);
    expect(res.getBody()).toEqual({
      isValueInRange: false
    });
  });

  test('200 and the note is returned if success', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = validNote;
    const res = new Response();

    await setNoteRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual(validNote);
  });

  test('Note is added to the note repository', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const noteRepository = new NoteRepositoryImpl();

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = validNote;
    const res = new Response();

    await setNoteRoute(tournamentRepository, noteRepository)(req, res);

    expect(noteRepository.getAll()).toEqual([validNote]);
  });
});

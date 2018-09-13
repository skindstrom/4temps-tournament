// @flow
import submitNotesRoute from '../submit-notes';
import {
  TournamentRepositoryImpl,
  Request,
  Response,
  generateId,
  createTournament,
  createParticipant,
  createRound,
  createJudge,
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
        active: true,
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
    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(
      new TournamentRepositoryImpl(),
      new NoteRepositoryImpl()
    )(req, res);

    expect(res.getStatus()).toBe(404);
  });

  test('401 is returned if the judge on the note is not the one logged in', async () => {
    const tournament = createTournament();
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(tournament);

    const req = Request.withJudgeAndParams(createJudge(), {
      tournamentId: tournament.id
    });

    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
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
    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
  });

  test('All notes must be for active dance', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [validNote, { ...validNote, danceId: 'dance2' }];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
  });

  test('Must submit all notes for dance', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();

    const tournamentWithTwoCriteria: Tournament = {
      ...hydratedTournament,
      participants: [participant],
      judges: [judge],
      rounds: [
        {
          ...createRound(),
          active: true,
          criteria: [criterion, { ...criterion, id: 'crit2' }],
          groups: [
            {
              id: generateId(),
              pairs: [{ leader: participant.id, follower: null }],
              dances: [dance]
            }
          ]
        }
      ]
    };
    await tournamentRepository.create(tournamentWithTwoCriteria);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: tournamentWithTwoCriteria.id
    });
    req.body = [validNote]; //missing note for crit2
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(400);
  });

  test('404 is returned if there is no such criterion', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });

    req.body = [{ ...validNote, criterionId: generateId() }];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
  });

  test('404 is returned if there is no such participant', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [{ ...validNote, participantId: generateId() }];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(404);
  });

  test('400 is returned if the value is not within range', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [{ ...validNote, value: 100 }];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(400);
  });

  test('All notes are validate', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(hydratedTournament);

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [validNote, { ...validNote, value: 100 }];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(400);
  });

  test('200 and the note is returned if success', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(
      JSON.parse(JSON.stringify(hydratedTournament))
    );

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, new NoteRepositoryImpl())(
      req,
      res
    );

    expect(res.getStatus()).toBe(200);
  });

  test('Note is added to the note repository', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(
      JSON.parse(JSON.stringify(hydratedTournament))
    );

    const noteRepository = new NoteRepositoryImpl();

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, noteRepository)(req, res);

    expect(noteRepository.getAll()).toEqual([validNote]);
  });

  test('400 is returned if submits multiple times', async () => {
    const tournamentRepository = new TournamentRepositoryImpl();
    await tournamentRepository.create(
      JSON.parse(JSON.stringify(hydratedTournament))
    );

    const noteRepository = new NoteRepositoryImpl();

    const req = Request.withJudgeAndParams(judge, {
      tournamentId: hydratedTournament.id
    });
    req.body = [validNote];
    const res = new Response();

    await submitNotesRoute(tournamentRepository, noteRepository)(req, res);
    expect(noteRepository.getAll()).toEqual([validNote]);

    await submitNotesRoute(tournamentRepository, noteRepository)(req, res);
    expect(res.getStatus()).toBe(400);
  });
});

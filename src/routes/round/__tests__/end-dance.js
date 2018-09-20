// @flow
import {
  Request,
  Response,
  createTournament,
  createRound,
  generateId,
  createParticipant,
  TournamentRepositoryImpl,
  createCriterion,
  NoteRepositoryImpl,
  createJudge
} from '../../../test-utils';
import EndDanceRoute from '../end-dance';

/**
 * X There should be an active dance
 * X All notes should be submitted
 * X Dance should be set as finished
 * X Another group should be generated (if last dance and possible)
 *    X If uneven count, pick a partner, that had the worst partner
 * - Set winners
 * - Set score
 */

describe('End dance route', () => {
  const updateLeaderboardFunc = () => {};

  const judge = createJudge();
  const participants = [
    { ...createParticipant(), role: 'leader' },
    { ...createParticipant(), role: 'follower' },
    { ...createParticipant(), role: 'leader' }
  ];
  const criterion = {
    ...createCriterion(),
    type: 'one'
  };
  const dance = {
    id: generateId(),
    active: true,
    finished: false
  };

  const tournament: Tournament = {
    ...createTournament(),
    participants,
    judges: [judge],
    rounds: [
      {
        ...createRound(),
        active: true,
        finished: false,
        minPairCountPerGroup: 1,
        maxPairCountPerGroup: 1,
        criteria: [criterion],
        groups: [
          {
            id: generateId(),
            pairs: [
              {
                leader: participants[0].id,
                follower: participants[1].id
              }
            ],
            dances: [
              dance,
              {
                id: generateId(),
                active: false,
                finished: false
              }
            ]
          }
        ]
      }
    ]
  };

  test('Return 404 if there is no active dance', async () => {
    const tournamentRepo = new TournamentRepositoryImpl();
    const noteRepo = new NoteRepositoryImpl();

    await tournamentRepo.create({
      ...tournament,
      rounds: [
        {
          ...tournament.rounds[0],
          groups: [
            {
              ...tournament.rounds[0].groups[0],
              dances: [{ ...dance, active: false }]
            }
          ]
        }
      ]
    });

    const route = new EndDanceRoute(
      tournamentRepo,
      noteRepo,
      updateLeaderboardFunc
    );

    const req = Request.withParams({ tournamentId: tournament.id });
    const res = new Response();

    await route.route()(req, res);

    expect(res.getStatus()).toBe(404);
    expect(res.getBody()).toEqual({ hasActiveDance: false });
  });

  test('Returns 400 if not all notes are submitted', async () => {
    const tournamentRepo = new TournamentRepositoryImpl();
    const noteRepo = new NoteRepositoryImpl();

    await tournamentRepo.create(tournament);
    // is missing note for one participant
    await noteRepo.createOrUpdate({
      judgeId: judge.id,
      criterionId: criterion.id,
      participantId: participants[0].id,
      value: 3,
      danceId: dance.id
    });

    const route = new EndDanceRoute(
      tournamentRepo,
      noteRepo,
      updateLeaderboardFunc
    );

    const req = Request.withParams({ tournamentId: tournament.id });
    const res = new Response();

    await route.route()(req, res);

    expect(res.getStatus()).toBe(400);
    expect(res.getBody()).toEqual({ isAllSubmitted: false });
  });

  describe('Returns 200 on success and...', () => {
    const expectedBody: Round = {
      ...tournament.rounds[0],
      groups: [
        {
          ...tournament.rounds[0].groups[0],
          dances: [
            { ...dance, active: false, finished: true },
            tournament.rounds[0].groups[0].dances[1]
          ]
        }
      ]
    };

    const noteRepo: NoteRepositoryImpl = new NoteRepositoryImpl();
    let tournamentRepo: TournamentRepositoryImpl;

    beforeAll(async () => {
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[0].id,
        value: 7,
        danceId: dance.id
      });
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[1].id,
        value: 3,
        danceId: dance.id
      });
    });

    beforeEach(async () => {
      tournamentRepo = new TournamentRepositoryImpl();
      await tournamentRepo.create(JSON.parse(JSON.stringify(tournament)));
    });

    test('sets round to finished and returns it', async () => {
      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(expectedBody);
    });

    test('updates repository', async () => {
      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect((await tournamentRepo.get(tournament.id)).rounds[0]).toEqual(
        expectedBody
      );
    });

    test("Generates a new group if it's the last dance", async () => {
      const updatedRound: Round = {
        ...tournament.rounds[0],
        groups: [
          {
            ...tournament.rounds[0].groups[0],
            dances: [
              { ...dance, active: false, finished: true },
              {
                ...tournament.rounds[0].groups[0].dances[1],
                active: true,
                finished: false
              }
            ]
          }
        ]
      };

      const expectedRound = {
        ...tournament.rounds[0],
        groups: [
          {
            ...tournament.rounds[0].groups[0],
            dances: [
              { ...dance, active: false, finished: true },
              {
                ...tournament.rounds[0].groups[0].dances[1],
                active: false,
                finished: true
              }
            ]
          },
          {
            pairs: [
              {
                leader: participants[2].id, // new participant
                follower: participants[1].id
              }
            ],
            dances: [
              {
                active: false,
                finished: false
              }
            ]
          }
        ]
      };

      const danceId = tournament.rounds[0].groups[0].dances[1].id;
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[0].id,
        value: 3,
        danceId
      });
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[1].id,
        value: 3,
        danceId
      });

      tournamentRepo.updateRound(tournament.id, updatedRound);

      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect((await tournamentRepo.get(tournament.id)).rounds[0]).toMatchObject(
        expectedRound
      );
    });

    test("If it's the last dance, finish the round, generate scores and winners", async () => {
      const tournament: Tournament = {
        ...createTournament(),
        participants: [participants[0], participants[1]],
        judges: [judge],
        rounds: [
          {
            ...createRound(),
            active: true,
            finished: false,
            minPairCountPerGroup: 1,
            maxPairCountPerGroup: 1,
            criteria: [criterion],
            groups: [
              {
                id: generateId(),
                pairs: [
                  {
                    leader: participants[0].id,
                    follower: participants[1].id
                  }
                ],
                dances: [dance]
              }
            ]
          }
        ]
      };

      await tournamentRepo.create(tournament);

      const expectedRound: Round = {
        ...tournament.rounds[0],
        active: false,
        finished: true,
        roundScores: [
          { participantId: participants[0].id, score: 7 },
          { participantId: participants[1].id, score: 3 }
        ],
        groups: [
          {
            ...tournament.rounds[0].groups[0],
            dances: [{ ...dance, active: false, finished: true }]
          }
        ]
      };

      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(expectedRound);
    });

    test("If it's the last dance, finish the round, generate scores and winners, multiple groups", async () => {
      const newParticipants = [
        { ...createParticipant(), role: 'leader' },
        { ...createParticipant(), role: 'follower' }
      ];
      const newDance: Dance = {
        id: generateId(),
        active: true,
        finished: false
      };

      const tournament: Tournament = {
        ...createTournament(),
        participants: [
          participants[0],
          participants[1],
          newParticipants[0],
          newParticipants[1]
        ],
        judges: [judge],
        rounds: [
          {
            ...createRound(),
            active: true,
            finished: false,
            minPairCountPerGroup: 1,
            maxPairCountPerGroup: 1,
            passingCouplesCount: 1,
            criteria: [criterion],
            groups: [
              {
                id: generateId(),
                pairs: [
                  {
                    leader: participants[0].id,
                    follower: participants[1].id
                  }
                ],
                dances: [{ ...dance, active: false, finished: true }]
              },
              {
                id: generateId(),
                pairs: [
                  {
                    leader: newParticipants[0].id,
                    follower: newParticipants[1].id
                  }
                ],
                dances: [newDance]
              }
            ]
          }
        ]
      };

      await tournamentRepo.create(tournament);
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: newParticipants[0].id,
        value: 2,
        danceId: newDance.id
      });
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: newParticipants[1].id,
        value: 1,
        danceId: newDance.id
      });

      const expectedRound: Round = {
        ...tournament.rounds[0],
        active: false,
        finished: true,
        roundScores: [
          { participantId: participants[0].id, score: 7 },
          { participantId: participants[1].id, score: 3 },
          { participantId: newParticipants[0].id, score: 2 },
          { participantId: newParticipants[1].id, score: 1 }
        ],
        groups: [
          tournament.rounds[0].groups[0],
          {
            ...tournament.rounds[0].groups[1],
            dances: [{ ...newDance, active: false, finished: true }]
          }
        ]
      };

      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(expectedRound);
    });

    test("Generates a new group if it's the second last group", async () => {
      const updatedRound: Round = {
        ...tournament.rounds[0],
        groups: [
          {
            ...tournament.rounds[0].groups[0],
            dances: [
              { ...dance, active: false, finished: true },
              {
                ...tournament.rounds[0].groups[0].dances[1],
                active: true,
                finished: false
              }
            ]
          },
          // $FlowFixMe
          {
            dances: [],
            pairs: []
          }
        ]
      };

      const expectedRound = {
        ...tournament.rounds[0],
        groups: [
          {
            ...tournament.rounds[0].groups[0],
            dances: [
              { ...dance, active: false, finished: true },
              {
                ...tournament.rounds[0].groups[0].dances[1],
                active: false,
                finished: true
              }
            ]
          },
          // $FlowFixMe
          {
            dances: [],
            pairs: []
          },
          {
            pairs: [
              {
                leader: participants[2].id, // new participant
                follower: participants[1].id
              }
            ],
            dances: [
              {
                active: false,
                finished: false
              }
            ]
          }
        ]
      };

      const danceId = tournament.rounds[0].groups[0].dances[1].id;
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[0].id,
        value: 3,
        danceId
      });
      await noteRepo.createOrUpdate({
        judgeId: judge.id,
        criterionId: criterion.id,
        participantId: participants[1].id,
        value: 3,
        danceId
      });

      tournamentRepo.updateRound(tournament.id, updatedRound);

      const route = new EndDanceRoute(
        tournamentRepo,
        noteRepo,
        updateLeaderboardFunc
      );

      const req = Request.withParams({ tournamentId: tournament.id });
      const res = new Response();

      await route.route()(req, res);

      expect(res.getStatus()).toBe(200);
      expect((await tournamentRepo.get(tournament.id)).rounds[0]).toMatchObject(
        expectedRound
      );
    });
  });
});

// @flow
import { GetParticipantsRouteHandler } from '../get-participants';
import type { Participant } from '../../../models/participant';
import {
  TOURNAMENT_ID, USER_ID, generateId,
  createTournament,
  ParticipantRepositoryImpl as ParticipantRepository,
  TournamentRepositoryImpl as TournamentRepository
} from '../../../test-utils';

describe('/api/participant/get', () => {
  let tournamentRepository: TournamentRepository;
  let participantRepository: ParticipantRepository;

  beforeEach(async () => {
    tournamentRepository = new TournamentRepository();
    await tournamentRepository.create(createTournament());

    participantRepository = new ParticipantRepository();
  });

  test('Unauthorized user results in no participants and status 401',
    async () => {
      const route = new GetParticipantsRouteHandler(generateId().toString(),
        tournamentRepository, participantRepository);

      expect(await route.getParticipantsForTournament(TOURNAMENT_ID.toString()))
        .toEqual([]);
      expect(route.status).toBe(401);
    });

  test('Valid user returns the participants with status 200', async () => {

    const participants: Array<Participant> = [
      {
        _id: 'id1',
        name: 'Participant Name',
        role: 'leader'
      },
      {
        _id: 'id2',
        name: 'Another Participant',
        role: 'follower'
      }
    ];

    for (const p of participants) {
      await participantRepository.createForTournament(
        TOURNAMENT_ID.toString(), p);
    }

    const route = new GetParticipantsRouteHandler(USER_ID.toString(),
      tournamentRepository, participantRepository);

    expect(await route.getParticipantsForTournament(TOURNAMENT_ID.toString()))
      .toEqual(participants);
    expect(route.status).toBe(200);
  });
});

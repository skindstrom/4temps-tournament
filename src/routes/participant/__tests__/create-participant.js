// @flow

import { CreateParticipantRouteHandler } from '../create-participant';
import {
  TOURNAMENT_ID, generateId,
  createUser, createTournament,
  TournamentRepositoryImpl as TournamentRepository,
  ParticipantRepositoryImpl as ParticipantRepository
} from '../../../test-utils';

describe('/api/participant/create', () => {

  const user = createUser();
  const VALID_BODY = {
    tournamentId: TOURNAMENT_ID.toString(),
    participant: {
      _id: '',
      name: 'Test User',
      role: 'leader'
    }
  };

  let tournamentRepository: TournamentRepository;
  let participantRepository: ParticipantRepository;

  beforeEach(async () => {
    tournamentRepository = new TournamentRepository();
    await tournamentRepository.create(createTournament());

    participantRepository = new ParticipantRepository();
  });

  test('Valid participant and tournament has status 200', async () => {
    const route =
      new CreateParticipantRouteHandler(user._id.toString(),
        tournamentRepository, participantRepository);

    route.parseBody(VALID_BODY);

    await route.createParticipant();
    expect(route.status).toBe(200);
  });

  test('Invalid participant has status 400', async () => {
    const route =
      new CreateParticipantRouteHandler(user._id.toString(),
        tournamentRepository, participantRepository);

    route.parseBody({
      ...VALID_BODY,
      participant: null
    });
    await route.createParticipant();
    expect(route.status).toBe(400);
  });

  test('Wrong user has status 401', async () => {
    const otherUserId = new generateId();
    const route =
      new CreateParticipantRouteHandler(otherUserId,
        tournamentRepository, participantRepository);

    route.parseBody(VALID_BODY);
    await route.createParticipant();
    expect(route.status).toBe(401);
  });

  test('Non-existing tournament has status 404', async () => {
    const route =
      new CreateParticipantRouteHandler(user._id.toString(),
        tournamentRepository, participantRepository);

    route.parseBody({...VALID_BODY, tournamentId: generateId().toString()});
    await route.createParticipant();
    expect(route.status).toBe(404);
  });
});

// @flow

import { CreateParticipantRouteHandler } from '../create-participant';
import {
  TOURNAMENT_ID, generateId,
  createAdmin, createTournament,
  TournamentRepositoryImpl as TournamentRepository,
} from '../../../test-utils';

describe('/api/participant/create', () => {

  const admin = createAdmin();
  const VALID_BODY = {
    tournamentId: TOURNAMENT_ID,
    participant: {
      name: 'Test Admin',
      role: 'leader'
    }
  };

  let tournamentRepository: TournamentRepository;

  beforeEach(async () => {
    tournamentRepository = new TournamentRepository();
    await tournamentRepository.create(createTournament());
  });

  test('Valid participant and tournament has status 200', async () => {
    const route =
      new CreateParticipantRouteHandler(
        admin._id.toString(), tournamentRepository);

    await tournamentRepository.create(createTournament());

    route.parseBody(VALID_BODY);

    await route.createParticipant();
    expect(route.status).toBe(200);
    expect(route._participant).toMatchObject(VALID_BODY.participant);
  });

  test('Invalid participant has status 400', async () => {
    const route =
      new CreateParticipantRouteHandler(
        admin._id.toString(), tournamentRepository);

    route.parseBody({
      ...VALID_BODY,
      participant: null
    });
    await route.createParticipant();
    expect(route.status).toBe(400);
  });

  test('Wrong admin has status 401', async () => {
    const otherAdminId = new generateId();
    const route =
      new CreateParticipantRouteHandler(otherAdminId,
        tournamentRepository);

    route.parseBody(VALID_BODY);
    await route.createParticipant();
    expect(route.status).toBe(401);
  });

  test('Non-existing tournament has status 404', async () => {
    const route =
      new CreateParticipantRouteHandler(admin._id.toString(),
        tournamentRepository);

    route.parseBody({...VALID_BODY, tournamentId: generateId()});
    await route.createParticipant();
    expect(route.status).toBe(404);
  });
});

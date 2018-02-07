// @flow
import { apiGetRequest } from '../util';

export function getAccessKeysForTournament(tournamentId: string): mixed {
  return apiGetRequest(`/api/access-key/${tournamentId}`);
}

export default getAccessKeysForTournament;
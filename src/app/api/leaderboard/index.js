// @flow

import { apiGetRequest } from '../util';

// eslint-disable-next-line import/prefer-default-export
export function getLeaderboardForTournament(
  tournamentId: string
): Promise<Leaderboard> {
  return apiGetRequest(`/api/leaderboard/${tournamentId}`);
}

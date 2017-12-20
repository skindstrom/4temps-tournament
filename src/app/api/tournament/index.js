// @flow

import validateTournament from '../../../validators/validate-tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';

export const createTournament =
  (tournament: Tournament): TournamentValidationSummary => {
    return validateTournament(tournament);
  };

export default createTournament;
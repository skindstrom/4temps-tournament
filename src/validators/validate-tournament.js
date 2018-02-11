// @flow
import type { Tournament } from '../models/tournament';

export type TournamentValidationSummary = {
  isValidTournament: boolean,
  isValidName: boolean,
  isValidDate: boolean,
  isValidType: boolean
};

const validateTournament = (tournament: Tournament) => {
  const isValidName = tournament.name !== '';
  const isValidType = tournament.type === 'jj' || tournament.type === 'classic';
  const isValidDate = !tournament.date.isSame(0);

  const isValidTournament = isValidName && isValidType && isValidDate;
  return {
    isValidTournament,
    isValidName,
    isValidDate,
    isValidType
  };
};

export default validateTournament;

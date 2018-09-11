// @flow
import {
  getTournamentsForUser,
  getTournamentForJudge,
  getTournament
} from '../api/tournament';
import { subscribeToUpdatesForTournaments } from '../api/realtime';

export function getAdminTournaments(dispatch: ReduxDispatch) {
  dispatch({
    type: 'GET_ADMIN_TOURNAMENTS',
    promise: getTournamentsForUser(),
    meta: {
      onSuccess: (_, getState) =>
        subscribeToUpdatesForTournaments(getState().tournaments.forAdmin)
    }
  });
}

export function getJudgeTournament(dispatch: ReduxDispatch) {
  dispatch({
    type: 'GET_JUDGE_TOURNAMENT',
    promise: getTournamentForJudge(),
    meta: {
      onSuccess: (_, getState) =>
        subscribeToUpdatesForTournaments([getState().tournaments.forJudge])
    }
  });
}

export function getSingleTournament(
  dispatch: ReduxDispatch,
  tournamentId: string
) {
  dispatch({
    type: 'GET_SINGLE_TOURNAMENT',
    promise: getTournament(tournamentId),
    meta: {
      onSuccess: () => subscribeToUpdatesForTournaments([tournamentId])
    }
  });
}

// @flow
import { handle } from 'redux-pack';
import { normalizeTournamentArray } from './normalize';

function rounds(state: RoundsReduxState = getInitialState(),
  action: ReduxPackAction): RoundsReduxState {

  const { type } = action;

  switch (type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_USER_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_ROUND':
    return createRound(state, action);
  case 'DELETE_ROUND':
    return deleteRound(state, action);
  default:
    return state;
  }
}

export function getInitialState(): RoundsReduxState {
  return {
    isLoading: false,
    forTournament: {},
    byId: {},
  };
}

function createRound(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {

  const {payload} = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]: [
          ...(prevState.forTournament[payload.tournamentId] || []),
          payload.round.id]
      },
      byId: {
        ...prevState.byId,
        [payload.round.id]: payload.round
      }
    }),
  });
}

function deleteRound(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {

  const {payload} = action;
  return handle(state, action, {
    start: prevState => ({...prevState, isLoading: true}),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]:
          prevState.forTournament[payload.tournamentId]
            .filter(id => id != payload.roundId),
      },
      byId: Object.keys(prevState.byId).reduce((obj, id) => {
        if (id != payload.roundId) {
          return {...obj, [id]: prevState.byId[id]};
        }
        return obj;
      }, {})
    }),
    failure: prevState => ({...prevState, isLoading: false}),
  });
}

function getTournaments(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: prevState => {
      const norm = normalizeTournamentArray(payload);

      return {
        ...prevState,
        forTournament: {
          ...prevState.forTournament,
          ...norm.result.reduce(
            (acc, id) => {
              acc[id] = norm.entities.tournaments[id].rounds;
              return acc;
            }, {})
        },
        byId: {
          ...prevState.byId,
          ...norm.entities.rounds
        }
      };
    },
  });
}

export default rounds;

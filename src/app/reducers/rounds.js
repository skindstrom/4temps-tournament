// @flow
import { handle } from 'redux-pack';

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
  case 'START_ROUND':
    return startRound(state, action);
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
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce(
          (acc, id) => {
            acc[id] = payload.entities.tournaments[id].rounds;
            return acc;
          }, {})
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.rounds
      }
    }),
  });
}

function startRound(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      byId: {
        ...prevState.byId,
        [payload.id]: payload
      }
    }),
  });
}

export default rounds;

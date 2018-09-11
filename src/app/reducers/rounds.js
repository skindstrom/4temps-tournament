// @flow
import { handle } from 'redux-pack';

function rounds(
  state: RoundsReduxState = getInitialState(),
  action: ReduxPackAction
): RoundsReduxState {
  const { type } = action;

  switch (type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_ADMIN_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_ROUND':
    return createRound(state, action);
  case 'DELETE_ROUND':
    return deleteRound(state, action);
  case 'START_ROUND':
  case 'GENERATE_GROUPS':
  case 'START_NEXT_DANCE':
  case 'END_DANCE':
    return payloadIsRound(state, action);
  case 'GET_JUDGE_TOURNAMENT':
  case 'GET_SINGLE_TOURNAMENT':
    return getJudgeTournament(state, action);
  case 'TOURNAMENT_UPDATED':
    return tournamentUpdated(state, action);
  default:
    return state;
  }
}

export function getInitialState(): RoundsReduxState {
  return {
    isLoading: false,
    forTournament: {},
    byId: {}
  };
}

function createRound(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]: Array.from(
          new Set([
            ...(prevState.forTournament[payload.tournamentId] || []),
            payload.round.id
          ]).values()
        )
      },
      byId: {
        ...prevState.byId,
        [payload.round.id]: payload.round
      }
    })
  });
}

function deleteRound(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;
  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]: prevState.forTournament[
          payload.tournamentId
        ].filter(id => id != payload.roundId)
      },
      byId: Object.keys(prevState.byId).reduce((obj, id) => {
        if (id != payload.roundId) {
          return { ...obj, [id]: prevState.byId[id] };
        }
        return obj;
      }, {})
    }),
    failure: prevState => ({ ...prevState, isLoading: false })
  });
}

function getTournaments(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce((acc, id) => {
          acc[id] = payload.entities.tournaments[id].rounds;
          return acc;
        }, {})
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.rounds
      }
    })
  });
}

function getJudgeTournament(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.result]: payload.entities.tournaments[payload.result].rounds
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.rounds
      }
    })
  });
}

function payloadIsRound(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      byId: {
        ...prevState.byId,
        [payload.id]: payload
      }
    })
  });
}

function tournamentUpdated(
  state: RoundsReduxState,
  action: ReduxPackAction
): RoundsReduxState {
  const { payload } = action;
  return {
    ...state,
    forTournament: {
      ...state.forTournament,
      [payload.result]: payload.entities.tournaments[payload.result].rounds
    },
    byId: {
      ...state.byId,
      ...payload.entities.rounds
    }
  };
}

export default rounds;

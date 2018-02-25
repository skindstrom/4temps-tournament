// @flow

import { handle } from 'redux-pack';

export default function reducer(
  state: JudgesReduxState = getInitialState(),
  action: ReduxPackAction
): JudgesReduxState {
  switch (action.type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_ADMIN_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_JUDGE':
    return createJudge(state, action);
  case 'GET_JUDGE_TOURNAMENT':
    return getSingleTournament(state, action);
  case 'TOURNAMENT_UPDATED':
    return tournamentUpdated(state, action);
  default:
    return state;
  }
}

export function getInitialState(): JudgesReduxState {
  return {
    byId: {},
    forTournament: {}
  };
}

function getTournaments(
  state: JudgesReduxState,
  action: ReduxPackAction
): JudgesReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce((acc, id) => {
          acc[id] = payload.entities.tournaments[id].judges;
          return acc;
        }, {})
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.judges
      }
    })
  });
}

function createJudge(
  state: JudgesReduxState,
  action: ReduxPackAction
): JudgesReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.byId,
        [payload.tournamentId]: Array.from(
          new Set([
            ...prevState.forTournament[payload.tournamentId],
            payload.judge.id
          ]).values()
        )
      },
      byId: {
        ...prevState.byId,
        [payload.judge.id]: payload.judge
      }
    })
  });
}

function getSingleTournament(
  state: JudgesReduxState,
  action: ReduxPackAction
): JudgesReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.result]: payload.entities.tournaments[payload.result].judges
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.judges
      }
    })
  });
}

function tournamentUpdated(
  state: JudgesReduxState,
  action: ReduxPackAction
): JudgesReduxState {
  const { payload } = action;
  return {
    ...state,
    forTournament: {
      ...state.forTournament,
      [payload.result]: payload.entities.tournaments[payload.result].judges
    },
    byId: {
      ...state.byId,
      ...payload.entities.judges
    }
  };
}

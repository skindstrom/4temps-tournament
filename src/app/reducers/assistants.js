// @flow

import { handle } from 'redux-pack';

export default function reducer(
  state: AssistantsReduxState = getInitialState(),
  action: ReduxPackAction
): AssistantsReduxState {
  switch (action.type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_ADMIN_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_ASSISTANT':
    return createAssistant(state, action);
  case 'GET_STAFF_TOURNAMENT':
    return getSingleTournament(state, action);
  case 'TOURNAMENT_UPDATED':
    return tournamentUpdated(state, action);
  default:
    return state;
  }
}

export function getInitialState(): AssistantsReduxState {
  return {
    byId: {},
    forTournament: {}
  };
}

function getTournaments(
  state: AssistantsReduxState,
  action: ReduxPackAction
): AssistantsReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce((acc, id) => {
          acc[id] = payload.entities.tournaments[id].assistants;
          return acc;
        }, {})
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.assistants
      }
    })
  });
}

function createAssistant(
  state: AssistantsReduxState,
  action: ReduxPackAction
): AssistantsReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.byId,
        [payload.tournamentId]: Array.from(
          new Set([
            ...(prevState.forTournament[payload.tournamentId] || []),
            payload.assistant.id
          ]).values()
        )
      },
      byId: {
        ...prevState.byId,
        [payload.assistant.id]: payload.assistant
      }
    })
  });
}

function getSingleTournament(
  state: AssistantsReduxState,
  action: ReduxPackAction
): AssistantsReduxState {
  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.result]:
          payload.entities.tournaments[payload.result].assistants
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.assistants
      }
    })
  });
}

function tournamentUpdated(
  state: AssistantsReduxState,
  action: ReduxPackAction
): AssistantsReduxState {
  const { payload } = action;
  return {
    ...state,
    forTournament: {
      ...state.forTournament,
      [payload.result]: payload.entities.tournaments[payload.result].assistants
    },
    byId: {
      ...state.byId,
      ...payload.entities.assistants
    }
  };
}

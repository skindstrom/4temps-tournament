// @flow
import { handle } from 'redux-pack';

function tournaments(state: TournamentsReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type } = action;
  switch (type) {
  case 'GET_ALL_TOURNAMENTS':
    return getAllTournaments(state, action);
  case 'GET_ADMIN_TOURNAMENTS':
    return getUserTournaments(state, action);
  case 'CREATE_TOURNAMENT':
    return createTournament(state, action);
  case 'EDIT_TOURNAMENT':
    return editTournament(state, action);
  case 'LOGOUT_USER':
    return logoutAdmin(state, action);
  default:
    return state;
  }
}

export function getInitialState(): TournamentsReduxState {
  return {
    isLoading: false,
    isInvalidated: true,
    didLoadAdminTournaments: false,

    forAdmin: [],
    allIds: [],
    byId: {},
  };
}

function getAllTournaments(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {
  const { payload } = action;
  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      isLoading: false,
      isInvalidated: false,
      allIds: payload.result,
      byId: payload.entities.tournaments
    }),
    failure: prevState => ({
      ...prevState,
      isLoading: false,
      isInvalidated: false,
    }),
  });
}

function getUserTournaments(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {
  const { payload } = action;
  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      isLoading: false,
      didLoadAdminTournaments: true,
      forAdmin: payload.result,
      allIds:
        Array.from(
          new Set([...prevState.allIds, ...payload.result]).values()),
      byId: {
        ...prevState.byId,
        ...payload.entities.tournaments
      }
    }),
    failure: prevState => ({ ...prevState, isLoading: false })
  });
}

function createTournament(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {

  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      allIds: [...prevState.allIds, payload.id],
      byId: { ...prevState.byId, [payload.id]: payload },
      forAdmin: [...prevState.forAdmin, payload.id],
    }),
  });
}

function editTournament(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {

  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      byId: {
        ...prevState.byId,
        [payload.id]: payload
      },
    }),
  });
}

function logoutAdmin(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forAdmin: [],
      didLoadAdminTournaments: false
    })
  });
}

export default tournaments;

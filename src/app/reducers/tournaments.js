// @flow
import { handle } from 'redux-pack';
import normalize from './normalize';

function tournaments(state: TournamentsReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type } = action;
  switch (type) {
  case 'GET_ALL_TOURNAMENTS':
    return getAllTournaments(state, action);
  case 'GET_USER_TOURNAMENTS':
    return getUserTournaments(state, action);
  case 'CREATE_TOURNAMENT':
    return createTournament(state, action);
  case 'EDIT_TOURNAMENT':
    return editTournament(state, action);
  case 'LOGOUT_USER':
    return logoutUser(state, action);
  default:
    return state;
  }
}

export function getInitialState(): TournamentsReduxState {
  return {
    isLoading: false,
    isInvalidated: true,
    didLoadUserTournaments: false,

    forUser: [],
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
      allIds: payload.map(({ _id }) => _id),
      byId: normalize(payload)
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
      didLoadUserTournaments: true,
      forUser: payload.map(({ _id }) => _id),
      allIds: [
        ...prevState.allIds,
        ...payload.map(({ _id }) => _id)]
        .filter((id, i, arr) => arr.indexOf(id) === i),
      byId: { ...prevState.byId, ...normalize(payload) }
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
      allIds: [...prevState.allIds, payload._id],
      byId: { ...prevState.byId, [payload._id]: payload },
      forUser: [...prevState.forUser, payload._id],
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
        [payload._id]: payload
      },
    }),
  });
}

function logoutUser(state: TournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {
  return handle(state, action, {
    success: prevState => ({ ...prevState, forUser: [] })
  });
}

export default tournaments;
// @flow
import { handle } from 'redux-pack';
import normalize from './normalize';

function tournaments(state: TournamentReduxState = getInitialState(),
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
  default:
    return state;
  }
}

export function getInitialState(): TournamentReduxState {
  return {
    isLoading: false,
    isInvalidated: true,
    didLoadUserTournaments: false,

    forUser: [],
    allIds: [],
    byId: {},

    uiCreateTournament: {
      isLoading: false,
      validation: {
        isValidTournament: true,
        isValidName: true,
        isValidDate: true,
        isValidType: true
      }
    },

    uiEditTournament: {
      isValidName: true,
      isValidDate: true
    }
  };
}

function getAllTournaments(state: TournamentReduxState,
  action: ReduxPackAction): TournamentReduxState {
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

function getUserTournaments(state: TournamentReduxState,
  action: ReduxPackAction): TournamentReduxState {
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

function createTournament(state: TournamentReduxState,
  action: ReduxPackAction): TournamentReduxState {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({
      ...prevState,
      uiCreateTournament: {
        ...prevState.uiCreateTournament,
        isLoading: true
      }
    }),
    success: prevState => ({
      ...prevState,
      allIds: [...prevState.allIds, payload._id],
      byId: { ...prevState.byId, [payload._id]: payload },
      forUser: [...prevState.forUser, payload._id],
      uiCreateTournament: getInitialState().uiCreateTournament
    }),
    failure: prevState => ({
      ...prevState,
      uiCreateTournament: {
        ...prevState.uiCreateTournament,
        isLoading: false,
        validation: payload
      }
    })
  });
}

function editTournament(state: TournamentReduxState,
  action: ReduxPackAction): TournamentReduxState {

  const { payload } = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      byId: {
        ...prevState.byId,
        [payload._id]: payload
      },
      uiEditTournament: {
        isValidName: true,
        isValidDate: true
      }
    }),
    failure: prevState => ({
      ...prevState,
      uiEditTournament: {
        isValidName: payload.isValidName,
        isValidDate: payload.isValidDate,
      }
    }),
  });
}

export default tournaments;
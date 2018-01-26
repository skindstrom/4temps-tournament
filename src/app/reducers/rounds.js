// @flow
import { handle } from 'redux-pack';
import normalize from './normalize';

function rounds(state: RoundsReduxState = getInitialState(),
  action: ReduxPackAction): RoundsReduxState {

  const { type } = action;

  switch (type) {
  case 'GET_ROUNDS':
    return getRounds(state, action);
  case 'CREATE_ROUND':
    return createRound(state, action);
  case 'UPDATE_ROUNDS':
    return updateRounds(state, action);
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

function getRounds(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {

  const {payload} = action;

  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      isLoading: false,
      forTournament: {
        ...prevState.byId,
        [payload.tournamentId]: payload.rounds.map(({ _id }) => _id),
      },
      byId: {
        ...prevState.byId,
        ...normalize(payload.rounds)
      }
    }),
    failure: prevState => ({ ...prevState, isLoading: false })
  });
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
          payload.round._id]
      },
      byId: {
        ...prevState.byId,
        [payload.round._id]: payload.round
      }
    }),
  });
}

function updateRounds(
  state: RoundsReduxState, action: ReduxPackAction): RoundsReduxState {

  const {payload} = action;

  return handle(state, action, {
    start: prevState => ({...prevState, isLoading: true}),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]: payload.rounds.map(({_id}) => _id),
      },
      byId: {
        ...prevState.byId,
        ...normalize(payload.rounds)
      }
    }),
    failure: prevState => ({...prevState, isLoading: false}),
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

export default rounds;

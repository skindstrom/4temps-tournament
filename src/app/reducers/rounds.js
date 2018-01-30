// @flow
import { handle } from 'redux-pack';
import normalize from './normalize';

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
          payload.round._id]
      },
      byId: {
        ...prevState.byId,
        [payload.round._id]: payload.round
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
      const tournaments: {[string]: Tournament} = normalize(payload);
      const rounds =
        Object.keys(tournaments)
          .reduce(
            (acc, key) => [...acc, ...tournaments[key].rounds], []);

      return {
        ...prevState,
        forTournament: {
          ...prevState.forTournament,
          ...payload.reduce(
            (acc, t) => {
              acc[t._id] = t.rounds.map((p) => p._id);
              return acc;
            }, {})
        },
        byId: {
          ...prevState.byId,
          ...normalize(rounds)
        }
      };
    },
  });
}

export default rounds;

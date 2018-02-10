// @flow

import {handle} from 'redux-pack';

export default function reducer(
  state: JudgesReduxState = getInitialState(),
  action: ReduxPackAction): JudgesReduxState {

  switch(action.type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_ADMIN_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_JUDGE':
    return createJudge(state, action);
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
  state: JudgesReduxState, action: ReduxPackAction): JudgesReduxState {

  const { payload } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce(
          (acc, id) => {
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
  state: JudgesReduxState, action: ReduxPackAction): JudgesReduxState {

  const {payload} = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.byId,
        [payload.tournamentId]:
          [
            ...(prevState.forTournament[payload.tournamentId] || []),
            payload.judge.id
          ]
      },
      byId: {
        ...prevState.byId,
        [payload.judge.id]: payload.judge
      }
    })
  });
}
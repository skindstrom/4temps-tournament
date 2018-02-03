// @flow

import {handle} from 'redux-pack';
import { normalizeTournamentArray } from './normalize';

export default function reducer(
  state: JudgesReduxState = getInitialState(),
  action: ReduxPackAction): JudgesReduxState {

  switch(action.type) {
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_USER_TOURNAMENTS':
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

  const {payload} = action;
  return handle(state, action, {
    success: prevState => {
      const norm = normalizeTournamentArray(payload);

      return {
        ...prevState,
        forTournament: {
          ...prevState.forTournament,
          ...norm.result.reduce(
            (acc, id) => {
              acc[id] = norm.entities.tournaments[id].judges;
              return acc;
            }, {})
        },
        byId: {
          ...prevState.byId,
          ...norm.entities.judges
        }
      };
    }
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

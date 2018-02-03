// @flow

import {handle} from 'redux-pack';
import normalize from './normalize';

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
      const tournaments: {[string]: Tournament} = normalize(payload);
      const judges =
        Object.keys(tournaments)
          .reduce(
            (acc, key) => [...acc, ...tournaments[key].judges], []);

      return {
        ...prevState,
        forTournament: {
          ...prevState.forTournament,
          ...payload.reduce(
            (acc, t) => {
              acc[t.id] = t.judges.map((p) => p.id);
              return acc;
            }, {})
        },
        byId: {
          ...prevState.byId,
          ...normalize(judges)
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

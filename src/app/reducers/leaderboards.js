// @flow

import { handle } from 'redux-pack';

export default function leaderboardsReducer(
  state: LeaderboardsReduxState = getInitialState(),
  action: ReduxPackAction
): LeaderboardsReduxState {
  const { type, payload } = action;
  switch (type) {
  case 'GET_LEADERBOARD':
    return handle(state, action, {
      success: prevState => ({
        ...prevState,
        byId: {
          ...prevState.byId,
          [payload.tournamentId]: payload
        }
      })
    });
  }

  return state;
}

export function getInitialState(): LeaderboardsReduxState {
  return { byId: {} };
}

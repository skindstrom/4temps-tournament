// @flow
import { handle } from 'redux-pack';
import normalize from './normalize';

function rounds(state: RoundsReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type, payload } = action;
  switch (type) {
  case 'GET_ROUNDS':
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

export default rounds;
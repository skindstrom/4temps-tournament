// @flow
import { handle } from 'redux-pack';

function reducer(state: UiEditTournamentReduxState = getInitialState(),
  action: ReduxPackAction): UiEditTournamentReduxState {
  const { type } = action;
  switch (type) {
  case 'EDIT_TOURNAMENT':
    return editTournament(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UiEditTournamentReduxState {
  return {
    isValidName: true,
    isValidDate: true
  };
}

function editTournament(state: UiEditTournamentReduxState,
  action: ReduxPackAction): UiEditTournamentReduxState {

  const { payload } = action;

  return handle(state, action, {
    success: () => getInitialState(),
    failure: () => ({
      isValidName: payload.isValidName,
      isValidDate: payload.isValidDate,
    }),
  });
}

export default reducer;
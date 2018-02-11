// @flow
import { handle } from 'redux-pack';

function reducer(
  state: UiEditTournamentsReduxState = getInitialState(),
  action: ReduxPackAction
): UiEditTournamentsReduxState {
  const { type } = action;
  switch (type) {
  case 'EDIT_TOURNAMENT':
    return editTournament(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UiEditTournamentsReduxState {
  return {
    isValidName: true,
    isValidDate: true
  };
}

function editTournament(
  state: UiEditTournamentsReduxState,
  action: ReduxPackAction
): UiEditTournamentsReduxState {
  const { payload } = action;

  return handle(state, action, {
    success: () => getInitialState(),
    failure: () => ({
      isValidName: payload.isValidName,
      isValidDate: payload.isValidDate
    })
  });
}

export default reducer;

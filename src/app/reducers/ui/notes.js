// @flow

export default function uiNotesReducer(
  state: UiNotesReduxState = createInitialState(),
  action: ReduxPackAction
): UiNotesReduxState {
  switch (action.type) {
  case 'SELECT_PAIR':
    return { selectedPair: action.payload };
  }

  return state;
}

export function createInitialState(): UiNotesReduxState {
  return { selectedPair: null };
}

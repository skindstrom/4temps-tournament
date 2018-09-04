// @flow
import { handle } from 'redux-pack';

export default function uiNotesReducer(
  state: UiNotesReduxState = createInitialState(),
  action: ReduxPackAction
): UiNotesReduxState {
  switch (action.type) {
  case 'SELECT_PAIR':
    return { ...state, selectedPair: action.payload };
  case 'SUBMIT_NOTES':
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        isLoading: true,
        didSubmit: true
      }),
      success: prevState => ({
        ...prevState,
        isLoading: false,
        didSubmit: true,
        successfulSubmit: true
      }),
      failure: prevState => ({
        ...prevState,
        isLoading: false,
        didSubmit: true,
        successfulSubmit: false
      })
    });
  }

  return state;
}

export function createInitialState(): UiNotesReduxState {
  return {
    selectedPair: null,
    isLoading: false,
    didSubmit: false,
    successfulSubmit: false
  };
}

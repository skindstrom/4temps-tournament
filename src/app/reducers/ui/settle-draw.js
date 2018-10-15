// @flow
import { handle } from 'redux-pack';

export default function uiSettleDrawReducer(
  state: UiSettleDrawReduxState = createInitialState(),
  action: ReduxPackAction
): UiSettleDrawReduxState {
  switch (action.type) {
  case 'SETTLE_DRAW':
    return handle(state, action, {
      start: () => ({ ...createInitialState(), isLoading: true }),
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
        successfulSubmit: false,
        errorMessage: action.payload.error
      })
    });
  }

  return state;
}

export function createInitialState(): UiSettleDrawReduxState {
  return {
    isLoading: false,
    didSubmit: false,
    successfulSubmit: false,
    errorMessage: ''
  };
}

// @flow
import { handle } from 'redux-pack';

export default function reducer(
  state: UiCreateJudgeReduxState = getInitialState(),
  action: ReduxPackAction
): UiCreateJudgeReduxState {
  switch (action.type) {
  case 'CREATE_JUDGE':
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        isLoading: true,
        createdSuccessfully: false
      }),
      success: prevState => ({
        ...prevState,
        isValid: true,
        isLoading: false,
        createdSuccessfully: true
      }),
      failure: prevState => ({
        ...prevState,
        isValid: false,
        isLoading: false,
        createdSuccessfully: false
      })
    });
  default:
    return state;
  }
}

export function getInitialState(): UiCreateJudgeReduxState {
  return {
    isLoading: false,
    createdSuccessfully: false,
    isValid: true
  };
}

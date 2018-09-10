// @flow
import { handle } from 'redux-pack';

export default function reducer(
  state: UiCreateAssistantReduxState = getInitialState(),
  action: ReduxPackAction
): UiCreateJudgeReduxState {
  switch (action.type) {
  case 'CREATE_ASSISTANT':
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

export function getInitialState(): UiCreateAssistantReduxState {
  return {
    isLoading: false,
    createdSuccessfully: false,
    isValid: true
  };
}

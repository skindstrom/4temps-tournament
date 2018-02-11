// @flow

import { handle } from 'redux-pack';

function participants(
  state: UiCreateParticipantsReduxState = getInitialState(),
  action: ReduxPackAction
): UiCreateParticipantsReduxState {
  const { type } = action;

  switch (type) {
  case 'CREATE_PARTICIPANT':
    return createParticipant(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UiCreateParticipantsReduxState {
  return {
    isLoading: false,
    createdSuccessfully: false,
    validation: {
      isValidParticipant: true,
      isValidName: true,
      isValidRole: true
    }
  };
}

function createParticipant(
  state: UiCreateParticipantsReduxState,
  action: ReduxPackAction
): UiCreateParticipantsReduxState {
  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: () => ({
      ...getInitialState(),
      createdSuccessfully: true
    }),
    failure: () => ({
      isLoading: false,
      createdSuccessfully: false,
      validation: payload
    })
  });
}

export default participants;

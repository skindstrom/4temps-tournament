// @flow
import { handle } from 'redux-pack';

function reducer(state: UiCreateTournamentsReduxState = getInitialState(),
  action: ReduxPackAction) {
  const { type } = action;
  switch (type) {
  case 'CREATE_TOURNAMENT':
    return createTournament(state, action);
  default:
    return state;
  }
}

export function getInitialState(): UiCreateTournamentsReduxState {
  return {
    isLoading: false,
    validation: {
      isValidTournament: true,
      isValidName: true,
      isValidDate: true,
      isValidType: true
    }
  };
}

function createTournament(state: UiCreateTournamentsReduxState,
  action: ReduxPackAction): TournamentsReduxState {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({
      ...prevState,
      isLoading: true
    }),
    success: () => getInitialState(),
    failure: () => ({
      isLoading: false,
      validation: payload
    })
  });
}

export default reducer;
// @flow
import { handle } from 'redux-pack';

export type ReduxState = {
  isAuthenticated: boolean
}

function reducer(state: ReduxState = { isAuthenticated: false },
  action: ReduxAction) {
  const { type } = action;
  if (type === 'LOGOUT_USER') {
    return handle(state, action, {
      finish: (prevState) => ({ ...prevState, isAuthenticated: false })
    });
  }

  return state;
}

export default reducer;
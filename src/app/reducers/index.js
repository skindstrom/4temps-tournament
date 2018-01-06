// @flow
import { handle } from 'redux-pack';

function reducer(state: ReduxState = initialState(), action: ReduxAction) {
  // $FlowFixMe
  const { type, payload } = action;
  switch (type) {
  case 'LOGOUT_USER':
    return handle(state, action, {
      finish: (prevState) => ({ ...prevState, isAuthenticated: false })
    });
  case 'LOGIN_USER':
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        uiLogin: {
          ...state.uiLogin,
          isLoading: true,
        }
      }),
      success: (prevState) => ({
        ...prevState,
        isAuthenticated: true,
        uiLogin: {
          ...state.uiLogin,
          isLoading: false,
          ...payload
        }
      }),
      failure: prevState => ({
        ...prevState,
        uiLogin: {
          ...state.uiLogin,
          isLoading: false,
          ...payload
        }
      })
    });
  }

  return state;
}

export function initialState() {
  return {
    isAuthenticated: false,
    uiLogin: {
      isLoading: false,

      isValid: false,
      isValidEmail: true,
      isValidPassword: true,
      doesUserExist: true
    }
  };
}

export default reducer;
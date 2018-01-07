// @flow
import { handle } from 'redux-pack';

function reducer(state: ReduxState = initialState(), action: ReduxAction) {
  // $FlowFixMe
  const { type, payload } = action;

  switch (type) {
  case 'LOGOUT_USER':
    return handle(state, action, {
      success: (prevState) => ({ ...prevState, isAuthenticated: false })
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
  case 'GET_ALL_TOURNAMENTS':
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        tournaments: {
          ...state.tournaments,
          isLoading: true
        }
      }),
      success: prevState => ({
        ...prevState,
        tournaments: {
          ...state.tournaments,
          isLoading: false,
          allIds: payload.map(t => t._id),
          byId: normalize(payload)
        }
      }),
      failure: prevState => ({
        ...prevState,
        tournaments: {
          ...state.tournaments,
          isLoading: false,
        }
      })
    });
  }

  return state;
}

export function initialState(): ReduxState {
  return {
    isAuthenticated: false,
    tournaments: {
      isLoading: true,

      allIds: [],
      byId: {}
    },
    uiLogin: {
      isLoading: false,

      isValid: false,
      isValidEmail: true,
      isValidPassword: true,
      doesUserExist: true
    }
  };
}

function normalize(array: Array<{ _id: string, [string]: mixed}>) {
  const acc: {[string]: mixed} = {};
  array.forEach(t => {
    acc[t._id] = t;
  });

  return acc;
}

export default reducer;
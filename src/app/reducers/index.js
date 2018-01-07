// @flow
import { handle } from 'redux-pack';

function reducer(state: ReduxState = initialState(), action: ReduxAction) {
  // $FlowFixMe
  const { type, payload } = action;

  switch (type) {
  case 'LOGOUT_USER':
    return handle(state, action, {
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        isAuthenticated: false
      })
    });
  case 'LOGIN_USER':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        uiLogin: {
          ...prevState.uiLogin,
          isLoading: true,
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        isAuthenticated: true,
        uiLogin: {
          ...prevState.uiLogin,
          isLoading: false,
          ...payload
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        uiLogin: {
          ...prevState.uiLogin,
          isLoading: false,
          ...payload
        }
      })
    });
  case 'GET_ALL_TOURNAMENTS':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: true
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: false,
          allIds: payload.map(t => t._id),
          byId: normalize(payload)
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: false,
        }
      })
    });
  case 'GET_USER_TOURNAMENTS':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: true
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: false,
          forUser: payload.map(t => t._id),
          allIds: [
            ...prevState.tournaments.allIds,
            ...payload.map(t => t._id),
          ].filter((id, i, arr) => arr.indexOf(id) === i),
          byId: {
            ...prevState.tournaments.byId,
            ...normalize(payload)
          }
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...state.tournaments,
          isLoading: false
        }
      }),
    });
  case 'CREATE_TOURNAMENT':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          uiCreateTournament: {
            ...prevState.tournaments.uiCreateTournament,
            isLoading: false,
          }
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          allIds: [...prevState.tournaments.allIds, payload._id],
          byId: {
            ...prevState.tournaments.byId,
            [payload._id]: payload
          },
          uiCreateTournament: {
            ...prevState.tournaments.uiCreateTournament,
            isLoading: false,
            validation: {
              isValidTournament: true,
              isValidName: true,
              isValidDate: true,
              isValidType: true
            }
          }
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          uiCreateTournament: {
            ...prevState.tournaments.uiCreateTournament,
            isLoading: false,
            validation: payload
          }
        }
      }),
    });
  }

  return state;
}

export function initialState(): ReduxState {
  return {
    isAuthenticated: false,

    tournaments: {
      isLoading: true,

      forUser: [],
      allIds: [],
      byId: {},

      uiCreateTournament: {
        isLoading: false,
        validation: {
          isValidTournament: true,
          isValidName: true,
          isValidDate: true,
          isValidType: true
        }
      }
    },
    uiLogin: {
      isLoading: false,

      isValid: false,
      isValidEmail: true,
      isValidPassword: true,
      doesUserExist: true
    },
  };
}

function normalize(array: Array<{ _id: string, [string]: mixed }>) {
  const acc: { [string]: mixed } = {};
  array.forEach(t => {
    acc[t._id] = t;
  });

  return acc;
}

export default reducer;
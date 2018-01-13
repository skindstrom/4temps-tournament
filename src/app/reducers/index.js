// @flow
import { handle } from 'redux-pack';
import isAuthenticated from './is-authenticated';
import uiLogin from './ui-login';
import uiSignup from './ui-signup';

function reducer(state: ReduxState = initialState(), action: ReduxPackAction) {
  const { type, payload } = action;

  switch (type) {
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
          isInvalidated: false,
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
          isInvalidated: false,
        }
      })
    });
  case 'GET_USER_TOURNAMENTS':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: true,
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          isLoading: false,
          didLoadUserTournaments: true,
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
          didLoadUserTournaments: true,
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
            isLoading: true,
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
          forUser: [...prevState.tournaments.forUser, payload._id],
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
  case 'EDIT_TOURNAMENT':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          uiEditTournament: {
            ...prevState.tournaments.uiEditTournament,
            isLoading: true,
          }
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          byId: {
            ...prevState.tournaments.byId,
            [payload._id]: payload
          },
          uiEditTournament: {
            ...prevState.tournaments.uiEditTournament,
            isLoading: false,
            isValidName: true,
            isValidDate: true
          }
        },
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        tournaments: {
          ...prevState.tournaments,
          uiEditTournament: {
            ...prevState.tournaments.uiEditTournament,
            isLoading: false,
            isValidName: payload.isValidName,
            isValidDate: payload.isValidDate
          }
        }
      }),
    });
  case 'GET_PARTICIPANTS':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: true
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: false,
          forTournament: {
            ...prevState.participants.forTournament,
            [payload.tournamentId]: payload.participants.map(p => p._id),
          },
          byId: {
            ...prevState.participants.byId,
            ...normalize(payload.participants)
          }
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: false
        }
      })
    });
  case 'CREATE_PARTICIPANT':
    return handle(state, action, {
      start: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: true,
          uiCreateParticipant: {
            ...prevState.participants.uiCreateParticipant,
            isLoading: true
          }
        }
      }),
      success: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: false,
          forTournament: {
            ...prevState.participants.forTournament,
            [payload.tournamentId]:
              [...prevState.participants.forTournament[payload.tournamentId],
                payload.participant._id]
          },
          byId: {
            ...prevState.participants.byId,
            [payload.participant._id]: payload.participant
          },
          uiCreateParticipant: {
            isLoading: false,
            createdSuccessfully: true,
            validation: {
              isValidParticipant: true,
              isValidName: true,
              isValidRole: true
            }
          }
        }
      }),
      failure: (prevState: ReduxState): ReduxState => ({
        ...prevState,
        participants: {
          ...prevState.participants,
          isLoading: false,
          uiCreateParticipant: {
            ...prevState.participants.uiCreateParticipant,
            isLoading: false,
            createdSuccessfully: false,
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
      isInvalidated: true,
      didLoadUserTournaments: false,

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
      },
      uiEditTournament: {
        isLoading: false,
        isValidName: true,
        isValidDate: true
      }
    },
    participants: {
      isLoading: true,

      forTournament: {},
      byId: {},

      uiCreateParticipant: {
        isLoading: false,
        createdSuccessfully: false,
        validation: {
          isValidParticipant: true,
          isValidName: true,
          isValidRole: true
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
    uiSignUp: {
      isLoading: false,

      validation: {
        isValid: true,
        isValidEmail: true,
        isEmailNotUsed: true,
        isValidFirstName: true,
        isValidLastName: true,
        isValidPassword: true
      }
    }
  };
}

function normalize(array: Array<{ _id: string, [string]: mixed }>) {
  const acc: { [string]: mixed } = {};
  array.forEach(t => {
    acc[t._id] = t;
  });

  return acc;
}

function combinedReducer(state: ReduxState, action: ReduxPackAction) {
  return {
    ...reducer(state, action),
    isAuthenticated: isAuthenticated(state.isAuthenticated, action),
    uiLogin: uiLogin(state.uiLogin, action),
    uiSignUp: uiSignup(state.uiSignUp, action),
  };
}

export default combinedReducer;
// @flow
import { handle } from 'redux-pack';
import isAuthenticated from './is-authenticated';
import uiLogin from './ui-login';
import uiSignup from './ui-signup';
import tournaments from './tournaments';

function reducer(state: ReduxState = initialState(), action: ReduxPackAction) {
  const { type, payload } = action;

  switch (type) {
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
  const newState = reducer(state, action);
  return {
    ...newState,
    isAuthenticated: isAuthenticated(state.isAuthenticated, action),
    uiLogin: uiLogin(state.uiLogin, action),
    uiSignUp: uiSignup(state.uiSignUp, action),
    tournaments: {
      ...newState.tournaments,
      ...tournaments(state.tournaments, action),
    }
  };
}

export default combinedReducer;
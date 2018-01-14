// @flow

import { handle } from 'redux-pack';
import normalize from './normalize';

function participants(state: ParticipantReduxState = getInitialState(),
  action: ReduxPackAction): ParticipantReduxState {

  const { type } = action;

  switch (type) {
  case 'GET_PARTICIPANTS':
    return getParticipants(state, action);
  case 'CREATE_PARTICIPANT':
    return createParticipant(state, action);
  default:
    return state;
  }
}

export function getInitialState(): ParticipantReduxState {
  return {
    isLoading: false,
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
  };
}

function getParticipants(state: ParticipantReduxState,
  action: ReduxPackAction) {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]: payload.participants.map(({ _id }) => _id)
      },
      byId: {
        ...prevState.byId,
        ...normalize(payload.participants)
      }
    }),
    failure: prevState => ({ ...prevState, isLoading: false })
  });
}

function createParticipant(state: ParticipantReduxState,
  action: ReduxPackAction): ParticipantReduxState {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({
      ...prevState,
      uiCreateParticipant: {
        ...prevState.uiCreateParticipant,
        isLoading: true
      }
    }),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.tournamentId]:
          [...(prevState.forTournament[payload.tournamentId] || []),
            payload.participant._id]
      },
      byId: {
        ...prevState.byId,
        [payload.participant._id]: payload.participant
      },
      uiCreateParticipant: {
        createdSuccessfully: true,
        isLoading: false,
        validation: getInitialState().uiCreateParticipant.validation
      }
    }),
    failure: prevState => ({
      ...prevState,
      uiCreateParticipant: {
        ...prevState.uiCreateParticipant,
        isLoading: false,
        createdSuccessfully: false,
        validation: payload
      }
    })
  });
}

export default participants;
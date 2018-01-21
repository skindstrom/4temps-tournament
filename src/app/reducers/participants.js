// @flow

import { handle } from 'redux-pack';
import normalize from './normalize';

function participants(state: ParticipantsReduxState = getInitialState(),
  action: ReduxPackAction): ParticipantsReduxState {

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

export function getInitialState(): ParticipantsReduxState {
  return {
    isLoading: false,
    forTournament: {},
    byId: {},
  };
}

function getParticipants(state: ParticipantsReduxState,
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

function createParticipant(state: ParticipantsReduxState,
  action: ReduxPackAction): ParticipantsReduxState {

  const { payload } = action;

  return handle(state, action, {
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
      }
    }),
  });
}

export default participants;
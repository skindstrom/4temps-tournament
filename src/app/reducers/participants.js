// @flow

import { handle } from 'redux-pack';

function participants(state: ParticipantsReduxState = getInitialState(),
  action: ReduxPackAction): ParticipantsReduxState {

  const { type } = action;

  switch (type) {
  case 'CREATE_PARTICIPANT':
    return createParticipant(state, action);
  case 'GET_ALL_TOURNAMENTS':
  case 'GET_USER_TOURNAMENTS':
    return getTournaments(state, action);
  case 'CREATE_TOURNAMENT':
    return createTournament(state, action);
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
            payload.participant.id]
      },
      byId: {
        ...prevState.byId,
        [payload.participant.id]: payload.participant
      }
    }),
  });
}

function getTournaments(state: ParticipantsReduxState,
  action: ReduxPackAction): ParticipantsReduxState {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        ...payload.result.reduce(
          (acc, id) => {
            acc[id] = payload.entities.tournaments[id].participants;
            return acc;
          }, {})
      },
      byId: {
        ...prevState.byId,
        ...payload.entities.participants
      }
    }),
    failure: prevState => ({ ...prevState, isLoading: false })
  });
}

function createTournament(
  state: ParticipantsReduxState,
  action: ReduxPackAction): ParticipantsReduxState {

  const {payload} = action;

  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      forTournament: {
        ...prevState.forTournament,
        [payload.id]: []
      }
    })
  });
}

export default participants;

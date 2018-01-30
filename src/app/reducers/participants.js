// @flow

import { handle } from 'redux-pack';
import normalize from './normalize';

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
            payload.participant._id]
      },
      byId: {
        ...prevState.byId,
        [payload.participant._id]: payload.participant
      }
    }),
  });
}

function getTournaments(state: ParticipantsReduxState,
  action: ReduxPackAction): ParticipantsReduxState {

  const { payload } = action;

  return handle(state, action, {
    start: prevState => ({ ...prevState, isLoading: true }),
    success: prevState => {
      const tournaments: {[string]: Tournament} = normalize(payload);
      const participants =
        Object.keys(tournaments)
          .reduce(
            (acc, key) => [...acc, ...tournaments[key].participants], []);

      return {
        ...prevState,
        forTournament: {
          ...prevState.forTournament,
          ...payload.reduce(
            (acc, t) => {
              acc[t._id] = t.participants.map((p) => p._id);
              return acc;
            }, {})
        },
        byId: {
          ...prevState.byId,
          ...normalize(participants)
        }
      };
    },
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
        [payload._id]: []
      }
    })
  });
}

export default participants;

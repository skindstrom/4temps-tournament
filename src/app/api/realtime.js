// @flow

import io from 'socket.io-client';
import { normalizeTournament } from '../reducers/normalize';
import { deserializeTournament } from './tournament';

let socket: Socket;

export function setup(dispatch: ReduxDispatch) {
  socket = io();
  socket.on('tournament update', tournament => {
    // $FlowFixMe
    const normalized = normalizeTournament(deserializeTournament(tournament));
    dispatch({
      type: 'TOURNAMENT_UPDATED',
      payload: normalized
    });
  });
  socket.on('leaderboard update', leaderboard => {
    dispatch({
      type: 'GET_LEADERBOARD',
      promise: Promise.resolve(leaderboard)
    });
  });
}

export function subscribeToUpdatesForTournaments(ids: Array<string>) {
  ids.forEach(id => socket.emit('subscribe', `tournament/${id}`));
}

export function subscribeToLeaderboardForTournament(id: string) {
  socket.emit('subscribe', `leaderboard/${id}`);
}

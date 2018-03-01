// @flow

import { connect } from 'react-redux';
import type { Match, RouterHistory } from 'react-router-dom';
import PreloadContainer from '../PreloadContainer';
import { getLeaderboardForTournament } from '../../api/leaderboard';
import Component from './component';

type Props = {
  match: Match,
  history: RouterHistory
};

function mapStateToProps({ leaderboards }: ReduxState, { match }: Props) {
  const tournamentId = match.params.tournamentId || '';
  console.log(leaderboards.byId[tournamentId]);
  return {
    shouldLoad: leaderboards.byId[tournamentId] == null,
    Child: Component,
    leaderboard: leaderboards.byId[tournamentId]
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { match, history }: Props
) {
  const tournamentId = match.params.tournamentId;

  if (tournamentId == null) {
    history.push('/404');
  }

  return {
    load: () =>
      dispatch({
        type: 'GET_LEADERBOARD',
        promise: getLeaderboardForTournament(tournamentId || ''),
        meta: {
          onFailure: res => {
            if (!res.didFindTournament) {
              history.push('/404');
            }
          }
        }
      })
  };
}

const LeaderboardContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default LeaderboardContainer;

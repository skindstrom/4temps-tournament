// @flow

import { connect } from 'react-redux';
import type { Match, RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import Component from './component';
import type { RoundViewModel } from './component';
import { getTournamentsForUser } from '../../api/tournament';

type Props = {
  match: Match,
  history: RouterHistory
}

function mapStateToProps(
  state: ReduxState,
  { match }: Props) {

  const roundId = match.params.roundId || '';
  return {
    shouldLoad: !state.rounds.byId[roundId],
    Child: Component,
    round: createViewModelsForRound(state, roundId)
  };
}

function createViewModelsForRound(
  { rounds, participants }: ReduxState, roundId: string): ?RoundViewModel {

  const round = rounds.byId[roundId];
  if (!round) {
    return null;
  }

  const { groups, ...rest } = round;

  const viewModel: RoundViewModel = {
    ...rest,
    groups: groups.map(g => ({
      id: g.id,
      pairs: g.pairs.map((p, i) => ({
        id: i.toString(),
        leader: p.leader == null ? '' : participants.byId[p.leader].name,
        follower: p.follower == null ? '' : participants.byId[p.follower].name,
      }))
    }))
  };

  return viewModel;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    load: () => dispatch({
      type: 'GET_ADMIN_TOURNAMENTS',
      promise: getTournamentsForUser(),
      meta: {
        onFailure: () => history.push('/404')
      }
    })
  };
}

const RoundOverviewContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default RoundOverviewContainer;
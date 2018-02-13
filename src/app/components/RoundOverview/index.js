// @flow

import { connect } from 'react-redux';
import type { Match, RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import Component from './component';
import type { RoundViewModel } from './component';
import { getTournamentsForUser } from '../../api/tournament';
import { startNextDance, generateGroupsForRound } from '../../api/round';

type Props = {
  match: Match,
  history: RouterHistory
};

function mapStateToProps(state: ReduxState, { match }: Props) {
  const roundId = match.params.roundId || '';
  return {
    shouldLoad: !state.rounds.byId[roundId],
    Child: Component,
    round: createViewModelsForRound(state, roundId)
  };
}

function createViewModelsForRound(
  { rounds, participants }: ReduxState,
  roundId: string
): ?RoundViewModel {
  const round = rounds.byId[roundId];
  if (!round) {
    return null;
  }

  const { groups, ...rest } = round;

  let activeDance: ?number = null;
  let activeGroup: ?number = null;

  for (let i = 0; i < groups.length; ++i) {
    for (let j = 0; j < groups[i].dances.length; ++j) {
      if (groups[i].dances[j].active) {
        activeDance = j + 1;
        activeGroup = i + 1;
      }
    }
  }

  const viewModel: RoundViewModel = {
    ...rest,
    activeDance,
    activeGroup,
    groups: groups.map(g => ({
      id: g.id,
      pairs: g.pairs.map((p, i) => ({
        id: i.toString(),
        leader: p.leader == null ? '' : participants.byId[p.leader].name,
        follower: p.follower == null ? '' : participants.byId[p.follower].name
      }))
    }))
  };

  return viewModel;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { match, history }: Props
) {
  return {
    load: () =>
      dispatch({
        type: 'GET_ADMIN_TOURNAMENTS',
        promise: getTournamentsForUser(),
        meta: {
          onFailure: () => history.push('/404')
        }
      }),
    startDance: () =>
      dispatch({
        type: 'START_NEXT_DANCE',
        promise: startNextDance(match.params.tournamentId || '')
      }),
    generateGroups: () => {
      dispatch({
        type: 'GENERATE_GROUPS',
        promise: generateGroupsForRound(
          match.params.tournamentId || '',
          match.params.roundId || ''
        )
      });
    }
  };
}

const RoundOverviewContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default RoundOverviewContainer;

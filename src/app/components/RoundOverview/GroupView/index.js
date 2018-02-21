// @flow

import { connect } from 'react-redux';

import Component from './component';
import type { RoundViewModel } from './component';
import {
  startNextDance,
  generateGroupsForRound,
  endDance
} from '../../../api/round';

type Props = {
  tournamentId: string,
  roundId: string
};

function mapStateToProps(state: ReduxState, { roundId }: Props) {
  return {
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

  let activeDance: ?number;
  let activeGroup: ?number;

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
        leader: createParticipantViewModel(participants.byId[p.leader || '']),
        follower: createParticipantViewModel(
          participants.byId[p.follower || '']
        )
      }))
    }))
  };

  return viewModel;
}

function createParticipantViewModel(participant: ?Participant) {
  if (participant) {
    const { name, attendanceId } = participant;
    return { name, number: attendanceId.toString() };
  }
  return { name: '', number: '' };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { roundId, tournamentId }: Props
) {
  return {
    startDance: () =>
      dispatch({
        type: 'START_NEXT_DANCE',
        promise: startNextDance(tournamentId)
      }),
    generateGroups: () => {
      dispatch({
        type: 'GENERATE_GROUPS',
        promise: generateGroupsForRound(tournamentId, roundId)
      });
    },
    endDance: () =>
      dispatch({
        type: 'END_DANCE',
        promise: endDance(tournamentId)
      })
  };
}

const RoundGroupContainer = connect(mapStateToProps, mapDispatchToProps)(
  Component
);

export default RoundGroupContainer;

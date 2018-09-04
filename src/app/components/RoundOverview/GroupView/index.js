// @flow

import { connect } from 'react-redux';

import Component from './component';
import type { RoundViewModel, DanceNotes } from './component';
import {
  startNextDance,
  generateGroupsForRound,
  endDance,
  regenerateGroup
} from '../../../api/round';

type Props = {
  tournamentId: string,
  roundId: string
};

function mapStateToProps(state: ReduxState, { roundId, tournamentId }: Props) {
  return {
    round: createViewModelsForRound(state, roundId, tournamentId)
  };
}

function createViewModelsForRound(
  { rounds, participants, tournaments, judges }: ReduxState,
  roundId: string,
  tournamentId: string
): ?RoundViewModel {
  const round = rounds.byId[roundId];
  if (!round) {
    return null;
  }

  const { groups, ...rest } = round;
  let activeDanceId: ?string;
  let activeDance: ?number;
  const activeGroup: ?number = getActiveGroup(groups);
  const nextDance: ?number = getNextDance(groups);
  const nextGroup: ?number = getNextGroup(groups);
  for (let i = 0; i < groups.length; ++i) {
    for (let j = 0; j < groups[i].dances.length; ++j) {
      if (groups[i].dances[j].active) {
        activeDance = j + 1;
        activeDanceId = groups[i].dances[j].id;
      }
    }
  }
  const notes: DanceNotes =
    activeDance != null
      ? getNotes(activeDanceId, tournaments.byId[tournamentId], judges)
      : { judgesNoted: [], judgesNotNoted: [] };

  const viewModel: RoundViewModel = {
    ...rest,
    activeDance,
    activeGroup,
    nextDance,
    nextGroup,
    notes,
    groups: groups.map(g => ({
      id: g.id,
      pairs: g.pairs.map((p, i) => ({
        id: i.toString(),
        leader: createParticipantViewModel(participants.byId[p.leader || '']),
        follower: createParticipantViewModel(
          participants.byId[p.follower || '']
        )
      })),
      isStarted: g.dances.reduce(
        (isStarted, { active, finished }) => isStarted || active || finished,
        false
      )
    }))
  };

  return viewModel;
}

function getNotes(danceId, tournament, judges) {
  const tournamentJudges = judges.forTournament[tournament.id];
  const dancesNoted = tournament.dancesNoted || {};
  const judgesNoted = [];
  const judgesNotNoted = [];
  for (let judgeId of tournamentJudges) {
    const judgeNotes = dancesNoted[judgeId] || [];
    const judge = judges.byId[judgeId];
    if (judgeNotes.includes(danceId)) {
      judgesNoted.push(judge);
    } else {
      judgesNotNoted.push(judge);
    }
  }
  return {
    judgesNoted,
    judgesNotNoted
  };
}

function getActiveGroup(groups) {
  const activeGroups = [...Array(groups.length).keys()].filter(i => {
    const group = groups[i];
    return group.dances
      .map(d => !d.finished)
      .reduce((ack, r) => ack || r, false);
  });
  return activeGroups.length > 0 ? activeGroups[0] + 1 : null;
}

function getNextGroup(groups) {
  const groupsNotDanced = [...Array(groups.length).keys()].filter(i => {
    return notDanced(groups[i]);
  });
  return groupsNotDanced.length > 0 ? groupsNotDanced[0] + 1 : null;
}

function notDanced(group) {
  return !group.dances
    .map(dance => dance.finished || dance.active)
    .reduce((ack, r) => ack || r, false);
}

function getNextDance(groups) {
  let nextDance = 1;
  const relevantGroups = groups.filter(group => {
    return !group.dances
      .map(d => d.finished)
      .reduce((ack, r) => ack && r, true);
  });
  if (relevantGroups.length != 0) {
    const dances = relevantGroups[0].dances;
    const nonStartedDances = [...Array(dances.length).keys()].filter(i => {
      return !(dances[i].finished || dances[i].active);
    });
    if (nonStartedDances.length > 0) {
      nextDance = nonStartedDances[0] + 1;
    }
  }
  return nextDance;
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
      }),
    regenerateGroup: (groupId: string) => {
      regenerateGroup(tournamentId, roundId, groupId);
    }
  };
}

const RoundGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default RoundGroupContainer;

// @flow

import { connect } from 'react-redux';

import Component from './component';
import type {
  CriterionViewModel,
  StateProps,
  DispatchProps
} from './component';
import { setTemporaryNote } from '../../../../api/note';

function mapStateToProps(state: ReduxState): StateProps {
  const round = getRound(state);
  const tournamentId = getTournamentId(state);
  const danceId = getActiveDanceId(round);
  const judgeId = state.user.id;
  const { leaderId, followerId } = getPair(state);

  const judge = state.judges.byId[judgeId];

  return {
    tournamentId,
    danceId,
    judgeId,
    leaderId,
    leaderCriteria: getCriteriaForJudgeType(state, leaderId, judge.judgeType),
    followerId,
    followerCriteria: getCriteriaForJudgeType(
      state,
      followerId,
      judge.judgeType
    )
  };
}

function getTournamentId(state: ReduxState) {
  return state.tournaments.byId[state.tournaments.forJudge].id;
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance != null) {
      return dance.id;
    }
    return res;
  }, '');
}

function getFirstPair(round: Round): Pair {
  return round.groups.reduce(
    (res, group) => {
      if (group.dances.findIndex(({ active }) => active) !== -1) {
        return group.pairs[0];
      }
      return res;
    },
    { leader: null, follower: null }
  );
}

function getRound(state: ReduxState): Round {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  // $FlowFixMe
  return tournament.rounds.reduce((res, roundId) => {
    const round = state.rounds.byId[roundId];
    if (round.active) {
      return round;
    }
    return res;
  }, null);
}

function getCriteriaForJudgeType(
  state: ReduxState,
  participantId: string,
  judgeType: JudgeType
): Array<CriterionViewModel> {
  return getRound(state)
    .criteria.filter(crit => crit.forJudgeType === judgeType)
    .map(crit => ({
      id: crit.id,
      name: crit.name,
      description: crit.description,
      minValue: crit.minValue,
      maxValue: crit.maxValue,
      value: getValue(state.notes, participantId, crit.id),
      forJudgeType: crit.forJudgeType
    }));
}

function getValue(
  notes: NotesReduxState,
  participantId: string,
  criterionId: string
) {
  return notes.byParticipant[participantId] != null
    ? notes.byParticipant[participantId][criterionId] != null
      ? notes.byParticipant[participantId][criterionId].value
      : null
    : null;
}

function getPair(state: ReduxState): { leaderId: string, followerId: string } {
  let pairId = state.ui.notes.selectedPair;
  if (pairId == null) {
    const pair = getFirstPair(getRound(state));
    pairId = `${String(pair.leader)}${String(pair.follower)}`;
  }
  const leaderId = pairId.substr(0, pairId.length / 2);
  const followerId = pairId.substr(pairId.length / 2);

  return { leaderId, followerId };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onClick: (tournamentId: string, note: JudgeNote) => {
      dispatch({
        type: 'SET_NOTE',
        promise: setTemporaryNote(tournamentId, note),
        payload: note
      });
    }
  };
}

const SeparateNoteTakerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default SeparateNoteTakerContainer;

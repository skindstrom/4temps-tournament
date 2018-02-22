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
  const pairId = getPairId(state);

  return {
    tournamentId,
    danceId,
    judgeId,
    pairId,
    criteria: getCriteria(state, pairId)
  };
}

function getPairId(state: ReduxState) {
  let pairId = state.ui.notes.selectedPair;
  if (pairId == null) {
    const pair = getFirstPair(getRound(state));
    pairId = `${String(pair.leader)}${String(pair.follower)}`;
  }

  return pairId;
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
  return state.rounds.byId[tournament.rounds[tournament.rounds.length - 1]];
}

function getCriteria(
  state: ReduxState,
  pairId: string
): Array<CriterionViewModel> {
  return getRound(state).criteria.map(crit => ({
    id: crit.id,
    name: crit.name,
    description: crit.description,
    minValue: crit.minValue,
    maxValue: crit.maxValue,
    value: getValue(state.notes, pairId, crit.id)
  }));
}

function getValue(notes: NotesReduxState, pairId: string, criterionId: string) {
  const { leaderId, followerId } = getIds(pairId);

  const leaderValue =
    notes[leaderId] != null
      ? notes[leaderId][criterionId] != null
        ? notes[leaderId][criterionId].value
        : null
      : null;

  const followerValue =
    notes[followerId] != null
      ? notes[followerId][criterionId] != null
        ? notes[followerId][criterionId].value
        : null
      : null;

  return leaderValue === followerValue ? leaderValue : null;
}

function getIds(pairId: string): { leaderId: string, followerId: string } {
  const leaderId = pairId.substr(0, pairId.length / 2);
  const followerId = pairId.substr(pairId.length / 2);

  return { leaderId, followerId };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onClick: (tournamentId: string, note: JudgeNote) => {
      const { leaderId, followerId } = getIds(note.participantId);
      dispatch({
        type: 'SET_NOTE',
        promise: setTemporaryNote(tournamentId, {
          ...note,
          participantId: leaderId
        })
      });
      dispatch({
        type: 'SET_NOTE',
        promise: setTemporaryNote(tournamentId, {
          ...note,
          participantId: followerId
        })
      });
    }
  };
}

const PairNoteTakerContainer = connect(mapStateToProps, mapDispatchToProps)(
  Component
);

export default PairNoteTakerContainer;

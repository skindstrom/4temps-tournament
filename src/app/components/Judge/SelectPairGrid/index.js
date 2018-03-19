// @flow
import { connect } from 'react-redux';
import type { PairViewModel, StateProps, DispatchProps } from './component';
import Component from './component';

type Props = {
  roundId: string
};

function mapStateToProps(
  { tournaments, ui, rounds, participants, notes }: ReduxState,
  { roundId }: Props
): StateProps {
  const round = rounds.byId[roundId];
  const pairs = getPairViewModels(
    round,
    participants,
    notes,
    isClassicTournament(tournaments)
  );
  const activePairId =
    ui.notes.selectedPair == null ? pairs[0].id : ui.notes.selectedPair;
  return {
    activePairId,
    upperLayerPairs: pairs.map((pair, i) => {
      if (i % 2 === 0) {
        return null;
      }
      return pair;
    }),
    lowerLayerPairs: pairs.map((pair, i) => {
      if (i % 2 !== 0) {
        return null;
      }
      return pair;
    })
  };
}

function isClassicTournament(tournaments: TournamentsReduxState) {
  const tournament = tournaments.byId[tournaments.forJudge];
  return tournament.type === 'classic';
}

function getPairViewModels(
  round: Round,
  participants: ParticipantsReduxState,
  notes: NotesReduxState,
  isClassic: boolean
): Array<PairViewModel> {
  const pairs = getPairsOfRound(round);
  const criterionCount = round.criteria.length;

  return pairs.map(pair => {
    const leader = participants.byId[pair.leader || ''];
    const follower = participants.byId[pair.follower || ''];

    return {
      id: leader.id + follower.id,
      name: getPairName({ leader, follower }, isClassic),
      hasAllNotes:
        hasAllNotes(leader.id, notes, criterionCount) &&
        hasAllNotes(follower.id, notes, criterionCount)
    };
  });
}

function getPairName(
  { leader, follower }: { leader: Participant, follower: Participant },
  isClassic: boolean
): string {
  if (isClassic) {
    return String(leader.attendanceId);
  }
  return `L${leader.attendanceId} - F${follower.attendanceId}`;
}

function hasAllNotes(
  participantId: string,
  notes: NotesReduxState,
  criterionCount: number
) {
  if (notes.byParticipant[participantId] == null) {
    return false;
  }
  return (
    Object.keys(notes.byParticipant[participantId]).length === criterionCount
  );
}

function getPairsOfRound(round: Round): Array<Pair> {
  return round.groups.reduce((res, group) => {
    if (group.dances.findIndex(dance => dance.active) !== -1) {
      return group.pairs;
    }
    return res;
  }, []);
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onClickPair: (pair: string) => {
      dispatch({ type: 'SELECT_PAIR', payload: pair });
    }
  };
}

const SelectPairGridContainer = connect(mapStateToProps, mapDispatchToProps)(
  Component
);

export default SelectPairGridContainer;

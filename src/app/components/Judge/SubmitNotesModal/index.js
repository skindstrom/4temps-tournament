// TODO: set flow. Currently some weird error which takes all CPU during flow parsing
/* eslint-disable flowtype/no-types-missing-file-annotation */

import { connect } from 'react-redux';
import type { StateProps, DispatchProps } from './component';
import { submitNotes } from '../../../api/note';
import Component from './component';
import NoteChecker from '../../../../domain/note-checker';

function mapStateToProps(state: ReduxState): StateProps {
  const tournament = getTournament(state);
  const danceId = getActiveDanceId(getActiveRound(state));
  const notes = getNotesForActiveDance(state, danceId);
  const uiNotes = state.ui.notes;

  return {
    ...uiNotes,
    tournamentId: state.tournaments.forJudge,
    notes,
    hasAllNotes: hasAllNotes(tournament, danceId, notes, state.user.id)
  };
}

function hasAllNotes(
  tournament: Tournament,
  danceId: string,
  notes: Array<JudgeNote>,
  judgeId: string
) {
  const noteChecker = new NoteChecker(tournament);
  return noteChecker.allSetForDanceByJudge(danceId, notes, judgeId);
}

function getNotesForActiveDance(
  state: ReduxState,
  activeDanceId: string
): Array<JudgeNote> {
  return Object.keys(state.notes.byParticipant)
    .reduce((notes, participantId) => {
      return [
        ...notes,
        ...Object.keys(state.notes.byParticipant[participantId]).reduce(
          (acc, critId) => {
            return [...acc, state.notes.byParticipant[participantId][critId]];
          },
          []
        )
      ];
    }, [])
    .filter(({ danceId }) => danceId === activeDanceId);
}

function getActiveDanceId(round: Round): string {
  return round.groups.reduce((res, group) => {
    const dance = group.dances.find(({ active }) => active);
    if (dance) {
      return dance.id;
    }
    return res;
  }, '');
}

function getActiveRound(state: ReduxState): Round {
  const tournament = getTournament(state);
  // $FlowFixMe
  return tournament.rounds.reduce(
    (res, round) => (round.active ? round : res),
    null
  );
}

function getTournament(state: ReduxState): Tournament {
  const tournament = state.tournaments.byId[state.tournaments.forJudge];
  return {
    ...tournament,
    rounds: tournament.rounds.map(id => state.rounds.byId[id]),
    judges: tournament.judges.map(id => state.judges.byId[id])
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch): DispatchProps {
  return {
    onSubmit: (tournamentId: string, notes: Array<JudgeNote>) => {
      dispatch({
        type: 'SUBMIT_NOTES',
        promise: submitNotes(tournamentId, notes)
      });
    }
  };
}

const SubmitNotesModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default SubmitNotesModalContainer;

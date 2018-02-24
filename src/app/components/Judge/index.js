// @flow
import { connect } from 'react-redux';
import Judge from './component';
import PreloadContainer from '../PreloadContainer';
import { getTournamentForJudge } from '../../api/tournament';

function mapStateToProps({ tournaments, rounds, ui }: ReduxState) {
  const activeRound =
    tournaments.forJudge !== ''
      ? getActiveRound(
        tournaments.byId[tournaments.forJudge].rounds.map(
          id => rounds.byId[id]
        )
      )
      : null;

  const activeDanceId =
    activeRound != null ? getActiveDanceId(activeRound) : null;
  const notes = ui.notes;
  return {
    Child: Judge,
    shouldLoad: tournaments.forJudge === '',
    tournamentId: tournaments.forJudge,
    activeDanceId,
    activeRound,
    notesSubmitted: isNotesSubmitted(notes)

  };
}

function isNotesSubmitted({
  isLoading, didSubmit, successfulSubmit
}: UiNotesReduxState) {
  return !isLoading &&
    didSubmit &&
    successfulSubmit;
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () =>
      dispatch({
        type: 'GET_JUDGE_TOURNAMENT',
        promise: getTournamentForJudge()
      })
  };
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

function getActiveRound(rounds: Array<Round>): ?Round {
  return rounds.reduce((acc, round) => {
    if (isRoundActive(round)) {
      return round;
    }
    return acc;
  }, null);
}

function isRoundActive(round: Round): boolean {
  return (
    round.active && round.groups.reduce((a, b) => a || isGroupActive(b), false)
  );
}

function isGroupActive(group: DanceGroup): boolean {
  return group.dances.reduce((a, b) => a || b.active, false);
}

const JudgeContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default JudgeContainer;

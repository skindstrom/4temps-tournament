// @flow
import { connect } from 'react-redux';
import Judge from './component';
import type { Props as JudgeComponentProps } from './component';
import PreloadContainer from '../PreloadContainer';
import { getJudgeTournament } from '../../action-creators';

function mapStateToProps(state: ReduxState): JudgeComponentProps {
  const { tournaments, rounds, user, judges } = state;
  const activeRound =
    tournaments.forJudge !== ''
      ? getActiveRound(
        rounds.forTournament[tournaments.forJudge].map(id => rounds.byId[id])
      )
      : null;

  const activeDanceId =
    activeRound != null ? getActiveDanceId(activeRound) : null;
  return {
    Child: Judge,
    shouldLoad: tournaments.forJudge === '',
    tournamentId: tournaments.forJudge,
    activeDanceId,
    activeRound,
    notesSubmitted:
      tournaments.forJudge === ''
        ? false
        : isNotesSubmittedForDance(state, activeDanceId),
    judgeType:
      (judges.byId[user.id] && judges.byId[user.id].judgeType) || 'normal'
  };
}

function isNotesSubmittedForDance(
  { user, tournaments }: ReduxState,
  danceId: ?string
) {
  const tournament = tournaments.byId[tournaments.forJudge];
  if (tournament.dancesNoted && tournament.dancesNoted[user.id]) {
    return tournament.dancesNoted[user.id].includes(danceId);
  } else {
    return false;
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () => getJudgeTournament(dispatch)
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
    if (round.active) {
      return round;
    }
    return acc;
  }, null);
}

const JudgeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer);

export default JudgeContainer;

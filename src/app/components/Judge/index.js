// @flow
import { connect } from 'react-redux';
import Judge from './component';
import PreloadContainer from '../PreloadContainer';
import { getTournamentForJudge } from '../../api/tournament';

function mapStateToProps({ tournaments, rounds }: ReduxState) {
  return {
    Child: Judge,
    shouldLoad: tournaments.forJudge === '',
    hasActiveDance:
      tournaments.forJudge !== '' &&
      hasActiveDance(
        tournaments.byId[tournaments.forJudge].rounds.map(id => rounds.byId[id])
      )
  };
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

function hasActiveDance(rounds: Array<Round>): boolean {
  return rounds.reduce((a, b) => a || isRoundActive(b), false);
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

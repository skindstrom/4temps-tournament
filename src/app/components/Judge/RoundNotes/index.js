// @flow
import { connect } from 'react-redux';
import RoundNotes from './component';

function mapStateToProps({tournaments, rounds}: ReduxState) {
  const tournamentRounds: Array<Round> =
    tournaments.byId[tournaments.forJudge].rounds.map(id => rounds.byId[id]);
  const activePairs = getActivePairs(tournamentRounds);
  return {
    pairs: activePairs
  };
}

function getActivePairs(rounds: Array<Round>): Array<Pair> {
  for (let round of rounds) {
    if (round.active) return getActiveGroup(round).pairs;
  }
  throw new Error('No pairs are currently dancing');
}

function getActiveGroup(round: Round): DanceGroup {
  for(let group of round.groups) {
    if (hasActiveDance(group)) return group;
  }
  throw new Error('There is no active group.');
}

function hasActiveDance(group: DanceGroup): boolean {
  return group.dances.filter(dance => dance.active).length > 0;
}


// $FlowFixMe
const RoundNotesContainer = connect(mapStateToProps)(RoundNotes);
export default RoundNotesContainer;
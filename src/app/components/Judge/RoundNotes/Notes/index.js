// @flow
import { connect } from 'react-redux';
import Notes from './component';

function mapStateToProps({ tournaments, rounds }: ReduxState) {
  const tournamentRounds: Array<Round> = tournaments.byId[
    tournaments.forJudge
  ].rounds.map(id => rounds.byId[id]);
  const activeRound = getActiveRound(tournamentRounds);
  const criteria = activeRound.criteria;
  const dance = getActiveDance(activeRound);
  return {
    criteria: criteria,
    dance: dance
  };
}

function getActiveDance(round: Round): Dance {
  for (let group of round.groups) {
    const activeDances = group.dances.filter(d => d.active);
    if (activeDances.length > 0) return activeDances[0];
  }
  throw new Error('There is no active dance!');
}

function getActiveRound(tournamentRounds: Array<Round>): Round {
  for (let round of tournamentRounds) {
    if (round.active) return round;
  }
  throw new Error('There is no active round!');
}

// $FlowFixMe
const NotesContainer = connect(mapStateToProps)(Notes);
export default NotesContainer;

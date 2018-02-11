// @flow
import { connect } from 'react-redux';
import RoundInformation from './component';

function mapStateToProps({ tournaments, rounds }: ReduxState) {
  const tournamentRounds: Array<Round> = tournaments.byId[
    tournaments.forJudge
  ].rounds.map(id => rounds.byId[id]);
  const activeRound = getActiveRound(tournamentRounds);
  const activeGroupInformation = getActiveGroupInformation(activeRound);
  const activeDanceInformation = getActiveDanceInformation(
    activeGroupInformation.group
  );
  return {
    roundName: activeRound.name,
    groupInformation: activeGroupInformation,
    danceInformation: activeDanceInformation
  };
}

function getActiveRound(rounds: Array<Round>): Round {
  return rounds.filter(round => round.active)[0];
}

function getActiveGroupInformation(
  round: Round
): {
  group: DanceGroup,
  groupNumber: number,
  numberOfGroups: number
} {
  const numberOfGroups = round.groups.length;
  for (let i = 0; i < numberOfGroups; i++) {
    const dances = round.groups[i].dances;
    if (dances.filter(dance => dance.active).length > 0)
      return {
        group: round.groups[i],
        groupNumber: i + 1,
        numberOfGroups: numberOfGroups
      };
  }
  throw new Error('No active groups!');
}

function getActiveDanceInformation(
  group: DanceGroup
): {
  danceNumber: number,
  numberOfDances: number
} {
  const numberOfDances = group.dances.length;
  for (let i = 0; i < numberOfDances; i++) {
    if (group.dances[i].active)
      return { danceNumber: i + 1, numberOfDances: numberOfDances };
  }
  throw new Error('There is not active dance!');
}

// $FlowFixMe
const RoundInformationContainer = connect(mapStateToProps)(RoundInformation);
export default RoundInformationContainer;

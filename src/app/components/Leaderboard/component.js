// @flow
import React from 'react';
import {
  Container,
  Header,
  Divider,
  Tab
} from 'semantic-ui-react';
import './styles.css';
import RoundTables from './RoundTables';
import RemainingParticipants from './RemainingParticipants';

type Props = {
  leaderboard: ?Leaderboard
};

export default function Leaderboard({ leaderboard }: Props) {
  if (!leaderboard) {
    return <Error />;
  }
  return <ActualLeaderboard leaderboard={leaderboard} />;
}

function ActualLeaderboard({ leaderboard }: { leaderboard: Leaderboard }) {
  const panes = [
    {
      menuItem: 'Remaining Participants',
      render: () =>
        RenderRemainingParticipants(leaderboard.remainingParticipants)
    },
    {
      menuItem: 'Round Results',
      render: () => RenderRoundResults(leaderboard.rounds)
    }
  ];
  return (
    <Container styleName="pad">
      <Header as="h1">
        {leaderboard.tournamentName}
      </Header>
      <Divider />
      <Tab panes={panes} />
    </Container>
  );
}

function Error() {
  return (
    <Header as="h1" textAlign="center">
      Could not get leaderboard
    </Header>
  );
}

function RenderRoundResults(rounds) {
  return (
    <Tab.Pane>
      <RoundTables
        rounds={rounds.filter(({ isFinished }) => isFinished)}
      />
    </Tab.Pane>
  );
}

function RenderRemainingParticipants(remainingParticipants){
  return (
    <Tab.Pane>
      <RemainingParticipants
        participants={remainingParticipants}
      />
    </Tab.Pane>
  );
}
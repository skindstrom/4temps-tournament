// @flow
import React from 'react';
import {
  Container,
  Header,
  Grid,
  GridRow,
  GridColumn,
  Divider,
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
  return (
    <Container styleName="pad">
      <Header as="h1">
        {leaderboard.tournamentName}
      </Header>
      <Divider />
      <Grid stackable>
        <GridRow columns="2">
          <GridColumn>
            {<RemainingParticipants
              participants={leaderboard.remainingParticipants}
            />}
          </GridColumn>
          <GridColumn>
            <RoundTables
              rounds={leaderboard.rounds
                .filter(({ isFinished }) => isFinished)
              }
            />
          </GridColumn>
        </GridRow>
      </Grid>
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

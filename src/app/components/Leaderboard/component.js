// @flow
import React from 'react';
import {
  Container,
  Header,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableBody,
  TableCell,
  Grid,
  GridRow,
  GridColumn,
  Divider,
} from 'semantic-ui-react';
import './styles.css';
import RoundTables from './RoundTables';

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
            <Container styleName="pad">
              <Header as="h2">
                Round Results
              </Header>
              <RoundTables
                rounds={leaderboard.rounds
                  .filter(({ isFinished }) => isFinished)
                }
              />
            </Container>
          </GridColumn>
        </GridRow>
      </Grid>
    </Container>
  );
}

function RemainingParticipants(
  { participants }: { participants: Array<Participant> }
) {
  return (
    <Container styleName="pad">
      <Header as="h2">
        Remaining Participants
      </Header>
      <Table unstackable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Participant ID</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map(RemainingEntry)}
        </TableBody>
      </Table>
    </Container>
  );
}
function RemainingEntry(
  participant: Participant
) {
  return (
    <TableRow key={participant.id}>
      <TableCell>{participant.attendanceId}</TableCell>
      <TableCell>{participant.role}</TableCell>
    </TableRow>
  );
}

function Error() {
  return (
    <Header as="h1" textAlign="center">
      Could not get leaderboard
    </Header>
  );
}

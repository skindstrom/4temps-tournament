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
  Divider
} from 'semantic-ui-react';
import './styles.css';

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
      <Grid stackable>
        <GridRow columns="2">
          <GridColumn>
            {<RemainingParticipants
              participants={leaderboard.remainingParticipants}
            />}
          </GridColumn>
          <GridColumn>
            {leaderboard.rounds
              .filter(({ isFinished }) => isFinished)
              .map(round => <RoundTables key={round.id} round={round} />)}
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

function RoundTables({ round }: { round: LeaderboardRound }) {
  return (
    <Container styleName="pad">
      <Header as="h2">
        Round Results
      </Header>
      <Grid stackable>
        <Header as="h2">{round.name}</Header>
        <GridRow>
          <Header as="h3">Winners</Header>
        </GridRow>
        <GridRow columns="2">
          <GridColumn>
            <Header as="h4">Leaders</Header>
            <ScoreTable scores={round.winningLeaderScores} />
          </GridColumn>
          <GridColumn>
            <Header as="h4">Followers</Header>
            <ScoreTable scores={round.winningFollowerScores} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <Divider />
          <Header as="h3">Participants that did not pass</Header>
        </GridRow>
        <GridRow columns="2">
          <GridColumn>
            <Header as="h4">Leaders</Header>
            <ScoreTable scores={round.losingLeaderScores} />
          </GridColumn>
          <GridColumn>
            <Header as="h4">Followers</Header>
            <ScoreTable scores={round.losingFollowerScores} />
          </GridColumn>
        </GridRow>
      </Grid>
    </Container>
  );
}

function ScoreTable({ scores }: { scores: Array<LeaderboardScore> }) {
  return (
    <Table unstackable>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Position</TableHeaderCell>
          <TableHeaderCell>Score</TableHeaderCell>
          <TableHeaderCell>Participant ID</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>{scores.map(ScoreTableRow)}</TableBody>
    </Table>
  );
}

function ScoreTableRow(score: LeaderboardScore) {
  return (
    <TableRow key={score.id}>
      <TableCell>{score.position}</TableCell>
      <TableCell>{score.score}</TableCell>
      <TableCell>{score.attendanceId}</TableCell>
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

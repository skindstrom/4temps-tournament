// @flow

import React from 'react';
import {
  Divider,
  Segment,
  Header,
  Grid,
  GridRow,
  GridColumn,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableBody
} from 'semantic-ui-react';

export type Props = {
  isFinished: boolean,
  winningLeaderScores: Array<ScoreViewModel>,
  winningFollowerScores: Array<ScoreViewModel>,
  losingLeaderScores: Array<ScoreViewModel>,
  losingFollowerScores: Array<ScoreViewModel>
};

type ScoreViewTableProps = {
  winningLeaderScores: Array<ScoreViewModel>,
  winningFollowerScores: Array<ScoreViewModel>,
  losingLeaderScores: Array<ScoreViewModel>,
  losingFollowerScores: Array<ScoreViewModel>
};

export type ScoreViewModel = {
  participant: Participant,
  position: number,
  score: number
};

export default function ScoreView({ isFinished, ...rest }: Props) {
  return isFinished ? <ScoreTables {...rest} /> : <NotFinished />;
}

function ScoreTables(props: ScoreViewTableProps) {
  return (
    <Grid stackable>
      <GridRow>
        <Header as="h2">Winners</Header>
      </GridRow>
      <GridRow columns="2">
        <GridColumn>
          <Header as="h3">Leaders</Header>
          <ScoreTable scores={props.winningLeaderScores} />
        </GridColumn>
        <GridColumn>
          <Header as="h3">Followers</Header>
          <ScoreTable scores={props.winningFollowerScores} />
        </GridColumn>
      </GridRow>
      <GridRow>
        <Divider />
        <Header as="h2">Participants that did not pass</Header>
      </GridRow>
      <GridRow columns="2">
        <GridColumn>
          <Header as="h3">Leaders</Header>
          <ScoreTable scores={props.losingLeaderScores} />
        </GridColumn>
        <GridColumn>
          <Header as="h3">Followers</Header>
          <ScoreTable scores={props.losingFollowerScores} />
        </GridColumn>
      </GridRow>
    </Grid>
  );
}

function ScoreTable({ scores }: { scores: Array<ScoreViewModel> }) {
  return (
    <Table unstackable>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Position</TableHeaderCell>
          <TableHeaderCell>Score</TableHeaderCell>
          <TableHeaderCell>Participant ID</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>{scores.map(ScoreTableRow)}</TableBody>
    </Table>
  );
}

function ScoreTableRow(score: ScoreViewModel) {
  return (
    <TableRow key={score.participant.id}>
      <TableCell>{score.position}</TableCell>
      <TableCell>{score.score}</TableCell>
      <TableCell>{score.participant.attendanceId}</TableCell>
      <TableCell>{score.participant.name}</TableCell>
    </TableRow>
  );
}

function NotFinished() {
  return (
    <Segment basic textAlign="center" vertical>
      <Header as="h2">Scores will be shown once the round is done</Header>
    </Segment>
  );
}

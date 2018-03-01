// @flow
import React, { Component } from 'react';
import {
  Accordion,
  Icon,
  Grid,
  Table,
  Container,
  Header,
  Divider
} from 'semantic-ui-react';

type Props = {
  rounds: Array<LeaderboardRound>
}
type State = {
  activeIndex: number
}
export default class RoundTables extends Component<Props, State> {
  _renderRoundTable = (round: LeaderboardRound) => {
    return (
      <Container>
        <Accordion.Title>
          <Icon name='dropdown' />
          {round.name}
        </Accordion.Title>
        <Accordion.Content>
          <Grid stackable>
            <Grid.Row>
              <Header as="h3">Winners</Header>
            </Grid.Row>
            <Grid.Row columns="2">
              <Grid.Column>
                <Header as="h4">Leaders</Header>
                <ScoreTable scores={round.winningLeaderScores} />
              </Grid.Column>
              <Grid.Column>
                <Header as="h4">Followers</Header>
                <ScoreTable scores={round.winningFollowerScores} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Divider />
              <Header as="h3">Participants that did not pass</Header>
            </Grid.Row>
            <Grid.Row columns="2">
              <Grid.Column>
                <Header as="h4">Leaders</Header>
                <ScoreTable scores={round.losingLeaderScores} />
              </Grid.Column>
              <Grid.Column>
                <Header as="h4">Followers</Header>
                <ScoreTable scores={round.losingFollowerScores} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Container>
    );
  }
  render() {
    return (
      <Accordion styled>
        {this.props.rounds.map(r => this._renderRoundTable(r))}
      </Accordion>
    );
  }
}

function ScoreTable({ scores }: { scores: Array<LeaderboardScore> }) {
  return (
    <Table unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Position</Table.HeaderCell>
          <Table.HeaderCell>Score</Table.HeaderCell>
          <Table.HeaderCell>Participant ID</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{scores.map(ScoreTableRow)}</Table.Body>
    </Table>
  );
}

function ScoreTableRow(score: LeaderboardScore) {
  return (
    <Table.Row key={score.id}>
      <Table.Cell>{score.position}</Table.Cell>
      <Table.Cell>{score.score}</Table.Cell>
      <Table.Cell>{score.attendanceId}</Table.Cell>
    </Table.Row>
  );
}
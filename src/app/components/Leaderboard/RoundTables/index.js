// @flow
import React, { Component } from 'react';
import {
  Accordion,
  Icon,
  Grid,
  Table,
  Container,
  Header,
  Divider,
  SyntheticEvent
} from 'semantic-ui-react';
import '../styles.css';

type Props = {
  rounds: Array<LeaderboardRound>
}
type State = {
  activeIndex: number
}
export default class RoundTables extends Component<Props, State> {
  state = {
    activeIndex: -1
  }
  handleClick = (e: SyntheticEvent, titleProps: {index: number}) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  _renderRoundTable = (index: number) => {
    const round = this.props.rounds[index];
    return (
      <Container>
        <Accordion.Title
          active={this.state.activeIndex === index}
          index={index}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          {round.name}
        </Accordion.Title>
        <Accordion.Content
          active={this.state.activeIndex === index}
        >
          <Container styleName="pad">
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
          </Container>
        </Accordion.Content>
      </Container>
    );
  }
  render() {
    const { rounds } = this.props;
    return (
      <Container styleName="pad">
        <Accordion fluid>
          {[...Array(rounds.length).keys()].map(i => this._renderRoundTable(i))}
        </Accordion>
      </Container>
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
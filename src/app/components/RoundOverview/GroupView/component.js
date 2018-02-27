// @flow

import React, { Component } from 'react';
import {
  Header,
  Button,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHeaderCell,
  Container,
  Grid
} from 'semantic-ui-react';

type GroupViewModel = {
  id: string,
  pairs: Array<{
    id: string,
    follower: { name: string, number: string },
    leader: { name: string, number: string }
  }>
};

export type RoundViewModel = {
  id: string,
  name: string,
  danceCount: number,
  active: boolean,
  finished: boolean,
  activeGroup: ?number,
  activeDance: ?number,
  nextGroup: ?number,
  nextDance: ?number,
  groups: Array<GroupViewModel>,
  notes: DanceNotes
};

export type DanceNotes = {
  judgesNoted: Array<Judge>,
  judgesNotNoted: Array<Judge>
};

export type Props = {
  round: RoundViewModel,
  startDance: () => void,
  endDance: () => void,
  generateGroups: () => void
};

class RoundOverview extends Component<Props> {
  _renderState = () => {
    const { round } = this.props;
    if (round.active) {
      return (
        <Table basic="very" collapsing>
          <TableBody>
            <TableRow>
              {this._groupInformation()}
              {this._danceInformation()}
              <TableCell>
                {round.activeDance != null ? (
                  <Button color='red' onClick={this.props.endDance}>Stop dance</Button>
                ) : (
                  <Button color='green' onClick={this.props.startDance}>
                    Start next dance
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else if (round.finished) {
      return 'Finished';
    } else {
      return 'Not started';
    }
  };

  _groupInformation() {
    const round = this.props.round;
    let groupInformation = 'Current Group: None';
    if (round.activeGroup != null) {
      groupInformation = 'Current Group: ' + round.activeGroup.toString();
    } else if (round.nextGroup != null) {
      groupInformation = 'Next Group: ' + round.nextGroup.toString();
    }
    return (
      <TableCell>
        {groupInformation}
      </TableCell>
    );
  }

  _danceInformation() {
    const round = this.props.round;
    let danceInformation = 'Current Dance: None';
    if (round.activeDance != null) {
      danceInformation = 'Current Dance: ' + round.activeDance.toString();
    } else if(round.nextDance != null) {
      danceInformation = 'Next Dance: ' + round.nextDance.toString();
    }
    return (
      <TableCell>
        {danceInformation}
      </TableCell>
    );
  }

  _renderGroups = () => {
    const { active, groups } = this.props.round;
    if (active && groups.length === 0) {
      return <div>No groups generated / no participants in tournament</div>;
    } else if (groups.length === 0) {
      return (
        <div>You have to start the round before you can create groups</div>
      );
    }

    return (
      <div>
        {this.props.round.groups.map((group, i) => (
          <div key={group.id}>
            <Header as="h4">Group {i + 1}</Header>
            {this._renderGroup(group)}
          </div>
        ))}
      </div>
    );
  };

  _renderGroup = (group: GroupViewModel) => {
    return (
      <Table unstackable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell colSpan="2">Leader</TableHeaderCell>
            <TableHeaderCell colSpan="2">Follower</TableHeaderCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell collapsing>Number</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell collapsing>Number</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {group.pairs.map(({ id, leader, follower }) => (
            <TableRow key={id}>
              <TableCell>
                <Header as="h4">{leader.number}</Header>
              </TableCell>
              <TableCell>{leader.name}</TableCell>
              <TableCell>
                <Header as="h4">{follower.number}</Header>
              </TableCell>
              <TableCell>{follower.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  _renderScoreTable = () => {
    const judgesNoted = this.props.round.notes.judgesNoted;
    const judgesNotNoted = this.props.round.notes.judgesNotNoted;
    const judgeCount = judgesNoted.length + judgesNotNoted.length;
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Table color='green' key='green' inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Has Voted ({judgesNoted.length}/{judgeCount})
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {judgesNoted.map(judge => {
                  return (
                    <Table.Row key={judge.id}>
                      <Table.Cell>{judge.name}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column>
            <Table color='red' key='red' inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Waiting For ({judgesNotNoted.length}/{judgeCount})
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {judgesNotNoted.map(judge => {
                  return (
                    <Table.Row key={judge.id}>
                      <Table.Cell>{judge.name}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  _canGenerateGroups = () => {
    const { active, activeDance, activeGroup } = this.props.round;
    return active && activeDance == null && activeGroup == null;
  };

  _hasActiveDance = () => {
    return this.props.round.activeDance != null;
  }

  render() {
    return (
      <div>
        <Header as="h2">{this.props.round.name}</Header>
        {this._renderState()}
        {this._hasActiveDance() && (
          <Container>
            <Header as="h2">Scores</Header>
            {this._renderScoreTable()}
          </Container>
        )}
        {this._canGenerateGroups() && (
          <Button onClick={this.props.generateGroups}>
            Re-generate groups
          </Button>
        )}
        <Header as="h2">Groups</Header>
        {this._renderGroups()}
      </div>
    );
  }
}

export default RoundOverview;

// @flow

import React, { Component } from 'react';
import {
  Container,
  Header,
  Button,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHeaderCell
} from 'semantic-ui-react';

type GroupViewModel = {
  id: string,
  pairs: Array<{ id: string, follower: string, leader: string }>
};

export type RoundViewModel = {
  id: string,
  name: string,
  danceCount: number,
  active: boolean,
  finished: boolean,
  activeGroup: ?number,
  activeDance: ?number,
  groups: Array<GroupViewModel>
};

export type Props = {
  round: RoundViewModel,
  startDance: () => void
};

class RoundOverview extends Component<Props> {
  _renderState = () => {
    const { round } = this.props;
    if (round.active) {
      return (
        <Table basic="very" collapsing>
          <TableBody>
            <TableRow>
              <TableCell>
                Current group:{' '}
                {round.activeGroup != null ? round.activeGroup : 'None'}
              </TableCell>
              <TableCell>
                Current dance:{' '}
                {round.activeDance != null ? round.activeGroup : 'None'}
              </TableCell>
              <TableCell>
                <Button onClick={this.props.startDance}>
                  Start next dance
                </Button>
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

  _renderGroups = () => {
    const { groups } = this.props.round;
    if (groups.length === 0) {
      return 'Groups are not generated until the round is started';
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
      <Table collapsing unstackable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Leader</TableHeaderCell>
            <TableHeaderCell>Follower</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {group.pairs.map(({ id, leader, follower }) => (
            <TableRow key={id}>
              <TableCell>{leader}</TableCell>
              <TableCell>{follower}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  render() {
    return (
      <Container>
        <Header as="h2">{this.props.round.name}</Header>
        {this._renderState()}
        <Header as="h3">Groups</Header>
        {this._renderGroups()}
      </Container>
    );
  }
}

export default RoundOverview;

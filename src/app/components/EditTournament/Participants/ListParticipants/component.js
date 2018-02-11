// @flow
import React, { Component } from 'react';
import {
  Container,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Checkbox
} from 'semantic-ui-react';

type Props = {
  participants: Array<Participant>,
  onChangeAttending: (id: string, isAttending: boolean) => void,
  getParticipants: () => void
};

class ListParticipants extends Component<Props> {
  _renderItem = ({ id, name, role, isAttending }: Participant) => {
    return (
      <TableRow key={id}>
        <Table.Cell collapsing>
          <Checkbox
            slider
            onChange={() => this.props.onChangeAttending(id, !isAttending)}
            checked={isAttending}
          />
        </Table.Cell>
        <TableCell>{name}</TableCell>
        <TableCell>{this._roleToString(role)}</TableCell>
      </TableRow>
    );
  };

  _roleToString(role: ParticipantRole) {
    if (role === 'leader') {
      return 'Leader';
    } else if (role === 'follower') {
      return 'Follower';
    } else if (role === 'leaderAndFollower') {
      return 'Both';
    }
    return 'Invalid role';
  }

  render() {
    return (
      <Container>
        <Table unstackable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Present</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>ParticipantRole</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>{this.props.participants.map(this._renderItem)}</TableBody>
        </Table>
      </Container>
    );
  }
}

export default ListParticipants;

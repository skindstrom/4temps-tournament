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
  _renderItem = ({
    id,
    name,
    role,
    isAttending,
    attendanceId
  }: Participant) => {
    return (
      <TableRow
        key={id}
        onClick={() => this.props.onChangeAttending(id, !isAttending)}
      >
        <Table.Cell collapsing>
          <Checkbox slider checked={isAttending} />
        </Table.Cell>
        <TableCell>{attendanceId == null ? 'X' : attendanceId}</TableCell>
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
        <Table unstackable selectable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Present</TableHeaderCell>
              <TableHeaderCell>Participant Number</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>{this.props.participants.map(this._renderItem)}</TableBody>
        </Table>
      </Container>
    );
  }
}

export default ListParticipants;

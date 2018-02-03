// @flow
import React, { Component } from 'react';
import {
  Container,
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell
} from 'semantic-ui-react';

import type { Participant, Role } from '../../../../../models/participant';

type Props = {
  participants: Array<Participant>,

  getParticipants: () => void
}

class ListParticipants extends Component<Props> {
  _renderItem = ({ id, name, role }: Participant) => {
    return (
      <TableRow key={id}>
        <TableCell>{name}</TableCell>
        <TableCell>{this._roleToString(role)}</TableCell>
      </TableRow>
    );
  }

  _roleToString(role: Role) {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.participants.map(this._renderItem)}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

export default ListParticipants;
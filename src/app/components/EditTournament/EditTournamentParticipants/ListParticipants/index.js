// @flow
import React, { Component } from 'react';
import {
  Container, Loader,
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell
} from 'semantic-ui-react';

import type { Participant, Role } from '../../../../../models/participant';
import { getParticipants } from '../../../../api/participant';

type Props = {
  tournamentId: string
}

type State = {
  isLoading: boolean,
  participants: Array<Participant>
}

class ListParticipants extends Component<Props, State> {
  state = {
    isLoading: true,
    participants: []
  }

  componentDidMount() {
    this._getParticipants();
  }

  async _getParticipants() {
    this.setState({ isLoading: true });
    try {
      const participants = await getParticipants(this.props.tournamentId);
      this.setState({
        isLoading: false,
        participants
      });
    } catch (e) {
      this.setState({
        isLoading: false,
        participants: []
      });
    }
  }

  _renderItem = ({ name, role }: Participant, index: number) => {
    return (
      <TableRow key={index}>
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
        {this.state.isLoading && <Loader active={this.state.isLoading} />}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.participants.map(this._renderItem)}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

export default ListParticipants;
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container, Loader,
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell
} from 'semantic-ui-react';

import type { Participant, Role } from '../../../../../models/participant';
import { getParticipants } from '../../../../api/participant';

type Props = {
  shouldLoad: boolean,
  isLoading: boolean,
  participants: Array<Participant>,

  getParticipants: () => void
}

class ListParticipants extends Component<Props> {
  componentDidMount() {
    const { shouldLoad, getParticipants } = this.props;
    if (shouldLoad) {
      getParticipants();
    }
  }

  _renderItem = ({ _id, name, role }: Participant) => {
    return (
      <TableRow key={_id}>
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
    const { isLoading, participants } = this.props;
    return (
      <Container>
        {isLoading && <Loader active={isLoading} />}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map(this._renderItem)}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

type ConnectedProps = {
  tournamentId: string
}

function mapStateToProps({ participants }: ReduxState,
  { tournamentId }: ConnectedProps) {
  return {
    shouldLoad: !participants.forTournament[tournamentId],
    isLoading: participants.isLoading,
    participants:
      (participants.forTournament[tournamentId] || [])
        .map(id => participants.byId[id]),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { tournamentId }: ConnectedProps) {
  return {
    getParticipants: () => dispatch(
      {type: 'GET_PARTICIPANTS', promise: getParticipants(tournamentId)}
    )
  };
}

const ListParticipantsContainer =
  connect(mapStateToProps, mapDispatchToProps)(ListParticipants);

export default ListParticipantsContainer;
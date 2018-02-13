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
  Checkbox,
  Modal,
  Header,
  ModalContent,
  Button,
  ModalActions,
  Icon
} from 'semantic-ui-react';

type Props = {
  participants: Array<Participant>,
  onChangeAttending: (id: string, isAttending: boolean) => void
};

type State = {
  didClickUnAttend: boolean,
  unAttendParticipant: ?Participant
};

class ListParticipants extends Component<Props, State> {
  state = {
    didClickUnAttend: false,
    unAttendParticipant: null
  };

  _renderItem = (participant: Participant) => {
    const { id, name, role, isAttending, attendanceId } = participant;
    return (
      <TableRow key={id}>
        <Table.Cell collapsing>
          <Checkbox
            slider
            checked={isAttending}
            onChange={() => {
              if (isAttending) {
                this.setState({
                  didClickUnAttend: true,
                  unAttendParticipant: participant
                });
              } else {
                this.props.onChangeAttending(id, true);
              }
            }}
          />
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

  _hideModal = () => {
    this.setState({
      didClickUnAttend: false,
      unAttendParticipant: null
    });
  };

  render() {
    return (
      <Container>
        <Modal open={this.state.didClickUnAttend} onClose={this._hideModal}>
          <Header content="Un-attending participant" />
          <ModalContent>
            <p>
              Marking{' '}
              <b>
                {this.state.unAttendParticipant == null
                  ? 'someone'
                  : this.state.unAttendParticipant.name +
                    ' (' +
                    this.state.unAttendParticipant.attendanceId +
                    ')'}{' '}
              </b>
              as not-present
            </p>
          </ModalContent>
          <ModalActions>
            <Button color="red" onClick={this._hideModal}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="green"
              inverted
              onClick={() => {
                this.props.onChangeAttending(
                  // $FlowFixMe
                  this.state.unAttendParticipant.id,
                  false
                );
                this._hideModal();
              }}
            >
              <Icon name="checkmark" /> OK
            </Button>
          </ModalActions>
        </Modal>
        <Table selectable basic="very">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Present</TableHeaderCell>
              <TableHeaderCell collapsing>Participant Number</TableHeaderCell>
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

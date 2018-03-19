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
  Icon,
  Search,
  SyntheticEvent
} from 'semantic-ui-react';

type Props = {
  isClassic: boolean,
  participants: Array<Participant>,
  onChangeAttending: (id: string, isAttending: boolean) => void
};

type State = {
  isSearchLoading: boolean,
  searchValue: string,
  filterPresent: boolean,
  didClickUnAttend: boolean,
  unAttendParticipant: ?Participant
};

class ListParticipants extends Component<Props, State> {
  state = {
    isSearchLoading: false,
    searchValue: '',
    filterPresent: false,
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
    const { isClassic } = this.props;
    if (role === 'leader') {
      if (isClassic) {
        return 'Pair';
      }
      return 'Leader';
    } else if (role === 'follower') {
      if (isClassic) {
        return 'Dummy';
      }
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

  _handleFilterChange = (e: SyntheticEvent, data: {checked: boolean}) => {
    const { checked } = data;
    this.setState({filterPresent: checked});
  }

  _renderUnattendModal = () => {
    return (
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
          <Button color="red" onClick={this._hideModal}>
            <Icon name="remove" /> No
          </Button>
        </ModalActions>
      </Modal>
    );
  }

  handleSearchChange = (e: SyntheticEvent, { value }: {value: string}) => {
    this.setState({isSearchLoading: true, searchValue: value});
    this.setState({isSearchLoading: false});
  }

  _getNotPresent = () => {
    return this.props.participants.filter(p => !p.isAttending);
  }

  _searchParticipants = (participants: Array<Participant>) => {
    return participants.filter(p => {
      const name = p.name.toLowerCase();
      const search = this.state.searchValue.toLowerCase();
      return name.indexOf(search) !== -1;
    });
  }

  render() {
    let participants = this.state.filterPresent ?
      this._getNotPresent() :
      this.props.participants;
    participants = this._searchParticipants(participants);
    return (
      <Container>
        {this._renderUnattendModal()}
        <Table basic="very">
          <TableBody>
            <TableRow>
              <TableCell>
                <Search
                  loading={this.state.isSearchLoading}
                  onSearchChange={this.handleSearchChange}
                  value={this.state.searchValue}
                  showNoResults={false}
                />
              </TableCell>
              <TableCell textAlign='right'>
                <Checkbox
                  toggle
                  checked={this.state.filterPresent}
                  onChange={this._handleFilterChange}
                />
              </TableCell>
              <TableCell textAlign='left'>
                <b>Show only NOT present</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table selectable basic="very">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Present</TableHeaderCell>
              <TableHeaderCell collapsing>Participant Number</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>{participants.map(this._renderItem)}</TableBody>
        </Table>
      </Container>
    );
  }
}

export default ListParticipants;

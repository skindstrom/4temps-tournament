// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';
import type { RouterHistory, Location, Match } from 'react-router-dom';

import EditTournamentGeneral from './EditTournamentGeneral';
import EditTournamentParticipants from './EditTournamentParticipants';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {
  match: Match,
  location: Location,
  history: RouterHistory
}
type State = {
  activeTab: TabName
}

const Rounds = () => 'Overview of rounds, set round criteria etc.';
const Staff = () => 'Add and remove staff (judges, organizers, helpers)';

const getActiveTab = (pathname: string): TabName => {
  const splits = pathname.split('/');
  const tabName = splits[splits.length - 1];
  if (tabName !== 'rounds' && tabName !== 'staff'
    && tabName !== 'participants') {
    return 'general';
  }
  return tabName;
};

class EditTournament extends Component<Props, State> {

  state = {
    activeTab: getActiveTab(this.props.location.pathname),
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ activeTab: getActiveTab(nextProps.location.pathname) });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.activeTab !== nextState.activeTab;
  }

  _onClickTab = (tab: TabName) => {
    this.props.history.push(
      `/tournament/edit/${
        String(this.props.match.params.tournamentId)}/${tab}`);
    this.setState({ activeTab: tab });
  };

  _renderMenuItem = (tab: TabName, content: string) => {
    return (
      <MenuItem
        key={tab}
        active={this.state.activeTab === tab}
        onClick={() => this._onClickTab(tab)}
      >
        {content}
      </MenuItem>);
  }

  _renderGeneral = () => {
    return (
      <EditTournamentGeneral
        tournamentId={this.props.match.params.tournamentId || ''}
      />);
  }

  _renderRounds = () => <Rounds />
  _renderStaff = () => <Staff />
  _renderParticipants = () => (
    <EditTournamentParticipants
      tournamentId={this.props.match.params.tournamentId || ''}
    />);

  components = {
    'general': this._renderGeneral,
    'rounds': this._renderRounds,
    'staff': this._renderStaff,
    'participants': this._renderParticipants
  }

  render() {
    return (
      <Container>
        <Menu tabular>
          {
            [
              { name: 'general', content: 'General' },
              { name: 'rounds', content: 'Rounds' },
              { name: 'staff', content: 'Staff' },
              { name: 'participants', content: 'Participants' }
            ].map(({ name, content }) => this._renderMenuItem(name, content))
          }
        </Menu>
        {this.components[this.state.activeTab]()}
      </Container>
    );
  }
}

export default EditTournament;
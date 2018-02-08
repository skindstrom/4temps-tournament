// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';
import type { RouterHistory, Location, Match } from 'react-router-dom';

import General from './General';
import Participants from './Participants';
import Rounds from './Rounds';
import Judges from './Judges';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {
  match: Match,
  location: Location,
  history: RouterHistory
}
type State = {
  activeTab: TabName
}

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
      <General
        tournamentId={this._getTournamentId()}
      />);
  }

  _renderRounds = () => (
    <Rounds
      tournamentId={this._getTournamentId()}
      history={this.props.history}
    />);

  _renderStaff = () =>
    <Judges tournamentId={this._getTournamentId()} />

  _renderParticipants = () => (
    <Participants
      tournamentId={this._getTournamentId()}
    />);

  _getTournamentId = (): string => {
    return this.props.match.params.tournamentId || '';
  }

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

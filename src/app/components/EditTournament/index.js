// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';
import type { Match } from 'react-router-dom';

import EditTournamentGeneral from './EditTournamentGeneral';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {
  match: Match
}
type State = {
  activeTab: TabName
}

const Rounds = () => 'Overview of rounds, set round criteria etc.';
const Staff = () => 'Add and remove staff (judges, organizers, helpers)';
const Participants = () => 'Add and remove participants';

class EditTournament extends Component<Props, State> {
  state = {
    activeTab: 'general',
  }

  _onClickTab = (tab: TabName) => this.setState({ activeTab: tab });

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
  _renderParticipants = () => <Participants />

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
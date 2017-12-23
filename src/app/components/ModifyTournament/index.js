// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {}
type State = {
  activeTab: TabName
}

const General = () => 'Change name, date, type';
const Rounds = () => 'Overview of rounds, set round criteria etc.';
const Staff = () => 'Add and remove staff (judges, organizers, helpers)';
const Participants = () => 'Add and remove participants';

class ModifyTournament extends Component<Props, State> {
  static components = {
    general: <General />,
    rounds: <Rounds />,
    staff: <Staff />,
    participants: <Participants />
  }

  state = {
    activeTab: 'general'
  };

  _onClickTab = (tab: TabName) => { this.setState({ activeTab: tab }); };
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
        {ModifyTournament.components[this.state.activeTab]}
      </Container>
    );
  }
}

export default ModifyTournament;
// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';
import moment from 'moment';
import type Moment from 'moment';
import type { Match } from 'react-router-dom';

import { getTournament } from '../../api/tournament';

import General from './general';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {
  match: Match
}
type State = {
  activeTab: TabName,

  isLoading: boolean,

  name: string,
  date: Moment,

  isValidName: boolean,
  isValidDate: boolean
}

const Rounds = () => 'Overview of rounds, set round criteria etc.';
const Staff = () => 'Add and remove staff (judges, organizers, helpers)';
const Participants = () => 'Add and remove participants';

class ModifyTournament extends Component<Props, State> {
  state = {
    activeTab: 'general',

    isLoading: true,

    name: '',
    date: moment(),

    isValidName: true,
    isValidDate: true
  }

  componentDidMount() {
    const tournamentId = this.props.match.params.tournamentId;
    if (tournamentId != null) {
      this._getTournament(tournamentId);
    }
  }

  _getTournament = async (tournamentId: string) => {
    const apiResult = await getTournament(tournamentId);
    if (apiResult.result != null) {
      const { name, date } = apiResult.result;
      this.setState({ isLoading: false, name, date });
    }
  }

  _onClickTab = (tab: TabName) => this.setState({ activeTab: tab });
  _onChangeName = (name: string) => this.setState({ name });
  _onChangeDate = (date: Moment) => this.setState({ date });

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
    return (<General
      {...this.state}
      onChangeName={this._onChangeName}
      onChangeDate={this._onChangeDate}
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

export default ModifyTournament;
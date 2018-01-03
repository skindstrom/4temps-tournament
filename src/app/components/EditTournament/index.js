// @flow

import React, { Component } from 'react';
import { Container, Form, FormButton, Menu, MenuItem } from 'semantic-ui-react';
import moment from 'moment';
import type Moment from 'moment';
import type { Match } from 'react-router-dom';

import type { Tournament } from '../../../models/tournament';
import { updateTournament, getTournament } from '../../api/tournament';

import General from './general';

type TabName = 'general' | 'rounds' | 'staff' | 'participants';
type Props = {
  match: Match
}
type State = {
  activeTab: TabName,

  isLoading: boolean,

  tournament: Tournament,

  isValidName: boolean,
  isValidDate: boolean
}

const Rounds = () => 'Overview of rounds, set round criteria etc.';
const Staff = () => 'Add and remove staff (judges, organizers, helpers)';
const Participants = () => 'Add and remove participants';

class EditTournament extends Component<Props, State> {
  state = {
    activeTab: 'general',

    isLoading: true,

    tournament: {
      name: '',
      date: moment(),
      type: 'none'
    },

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
    const tournament = await getTournament(tournamentId);
    if (tournament != null) {
      this.setState({ isLoading: false, tournament });
    }
  }

  _onClickTab = (tab: TabName) => this.setState({ activeTab: tab });
  _onChangeName = (name: string) => this.setState({
    tournament: { ...this.state.tournament, name }
  });

  _onChangeDate = (date: Moment) => this.setState({
    tournament: { ...this.state.tournament, date }
  });

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
      isLoading={this.state.isLoading}

      name={this.state.tournament.name}
      date={this.state.tournament.date}

      isValidName={this.state.isValidName}
      isValidDate={this.state.isValidDate}

      onChangeName={this._onChangeName}
      onChangeDate={this._onChangeDate}
    />);
  }

  _renderRounds = () => <Rounds />
  _renderStaff = () => <Staff />
  _renderParticipants = () => <Participants />

  _onSubmit = async () => {
    this.setState({ isLoading: true });

    const tournamentId = this.props.match.params.tournamentId;
    if (tournamentId != null) {
      const result =
        await updateTournament(tournamentId, this.state.tournament);

      let updatedState = { ...this.state };
      updatedState.isLoading = false;

      if (result != null) {
        updatedState.isValidName = result.validation.isValidName;
        updatedState.isValidDate = result.validation.isValidDate;

        if (result.tournament != null) {
          updatedState.tournament = result.tournament;
        }
      }
      this.setState(updatedState);
    }
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
        <Form>
          {this.components[this.state.activeTab]()}
          <FormButton onClick={this._onSubmit} style={{ marginTop: '1em' }}>
            Submit
          </FormButton>
        </Form>
      </Container>
    );
  }
}

export default EditTournament;
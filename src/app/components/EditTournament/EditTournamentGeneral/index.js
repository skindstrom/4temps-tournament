// @flow

import React, { Component } from 'react';
import moment from 'moment';
import type Moment from 'moment';

import type { Tournament } from '../../../../models/tournament';
import { updateTournament, getTournament } from '../../../api/tournament';

import EditTournamentGeneral from './component';

type Props = {
  tournamentId: string
}
type State = {
  isLoading: boolean,

  tournament: Tournament,

  isValidName: boolean,
  isValidDate: boolean
}

class EditTournament extends Component<Props, State> {
  state = {
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
    const { tournamentId } = this.props;
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

  _onChangeName = (name: string) => this.setState({
    tournament: { ...this.state.tournament, name }
  });

  _onChangeDate = (date: Moment) => this.setState({
    tournament: { ...this.state.tournament, date }
  });

  _onSubmit = async () => {
    this.setState({ isLoading: true });

    const { tournamentId } = this.props;
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

  render() {
    return (
      <EditTournamentGeneral
        isLoading={this.state.isLoading}

        name={this.state.tournament.name}
        date={this.state.tournament.date}

        isValidName={this.state.isValidName}
        isValidDate={this.state.isValidDate}

        onChangeName={this._onChangeName}
        onChangeDate={this._onChangeDate}
        onSubmit={this._onSubmit}
      />);
  }
}

export default EditTournament;
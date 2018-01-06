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
    try {
      const tournament = await getTournament(tournamentId);
      this.setState({ isLoading: false, tournament });
    } catch (e) {
      alert('Could not fetch tournament');
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
      try {
        const { tournament, validation } =
          await updateTournament(tournamentId, this.state.tournament);

        if (tournament != null) {
          this.setState({
            isLoading: false,
            isValidName: validation.isValidName,
            isValidDate: validation.isValidDate
          });
        }
      } catch (validation) {
        this.setState({ isLoading: false, ...validation });
      }
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
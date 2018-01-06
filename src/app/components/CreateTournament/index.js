//@flow

import React, { Component } from 'react';
import type { RouterHistory } from 'react-router-dom';
import CreateTournament from './component';
import { createTournament } from '../../api/tournament';
import type { Tournament } from '../../../models/tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';

type Props = {
  history: RouterHistory
}
type State = {
  isLoading: boolean,
  validation: TournamentValidationSummary
};

class CreateTournamentContainer extends Component<Props, State> {
  state = {
    isLoading: false,
    validation: {
      isValidTournament: false,
      isValidName: true,
      isValidDate: true,
      isValidType: true
    }
  }

  _onSubmit = async (tournament: Tournament) => {
    this.setState({ isLoading: true });
    try {
      const { tournamentId } = await createTournament(tournament);
      if (tournamentId != null) {
        this.props.history.push(`/tournament/edit/${tournamentId}`);
      }
    } catch (validation) {
      this.setState({ isLoading: false, validation });
    }
  };

  render() {
    return (
      <CreateTournament
        {...this.state}
        onSubmit={this._onSubmit}
      />
    );
  }
}

export default CreateTournamentContainer;
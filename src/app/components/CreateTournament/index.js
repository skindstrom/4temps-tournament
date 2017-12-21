//@flow

import React, { Component } from 'react';
import CreateTournament from './component';
import { createTournament } from '../../api/tournament';
import type { Tournament } from '../../../models/tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';

type Props = {}
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
    const result = await createTournament(tournament);

    // TODO: Require some user action if no longer authenticated
    let validation =
      result.result != null ? result.result : this.state.validation;
    this.setState({ isLoading: false, validation });
  };

  render() {
    return (
      <CreateTournament
        {...this.state}
        onSubmit={this._onSubmit}
      />);
  }
}

export default CreateTournamentContainer;
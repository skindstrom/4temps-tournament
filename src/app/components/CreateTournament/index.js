//@flow

import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
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
    const result = await createTournament(tournament);


    if (result.wasAuthenticated && result.result != null) {
      let validation = result.result;
      this.setState({ isLoading: false, validation });

      if (validation.isValidTournament) {
        setTimeout(() =>
          this.props.history.push('/modify-tournament'), 800);
      }
    } else {
      this.setState({ isLoading: false });
      // TODO: Actually act in accordance
      alert('Invalid login session');
    }
  };

  render() {
    return (
      <div>
        <Modal
          open={this.state.validation.isValidTournament}
          header='Success!'
          content='Redirecting...'
        />
        <CreateTournament
          {...this.state}
          onSubmit={this._onSubmit}
        />
      </div>);
  }
}

export default CreateTournamentContainer;
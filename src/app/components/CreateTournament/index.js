//@flow

import React, { PureComponent } from 'react';
import CreateTournament from './component';
import { createTournament } from '../../api/tournament';
import type { Tournament } from '../../../models/tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';

type Props = {}
type State = TournamentValidationSummary;

class CreateTournamentContainer extends PureComponent<Props, State> {
  state = {
    isValidTournament: false,
    isValidName: true,
    isValidType: true
  }

  _onSubmit = (tournament: Tournament) => {
    const validation = createTournament(tournament);
    this.setState(validation);
  };

  render() {
    return (
      <CreateTournament
        validation={{ ...this.state }}
        onSubmit={this._onSubmit}
      />);
  }
}

export default CreateTournamentContainer;
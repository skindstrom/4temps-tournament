//@flow

import React, { PureComponent } from 'react';
import type Moment from 'moment';
import CreateTournament from './component';
import type { TournamentType } from './component';

type Props = {}
type State = {
  isValidInput: boolean,
  isValidName: boolean,
  isValidType: boolean,
}

class CreateTournamentContainer extends PureComponent<Props, State> {
  state = {
    isValidInput: false,
    isValidName: true,
    isValidType: true
  }

  _onSubmit = (name: string, date: Moment, type: TournamentType) => {
    const isValidName = name !== '';
    const isValidType = type !== 'none';
    const isValidInput = isValidName && isValidType;
    this.setState({ isValidInput, isValidName, isValidType });
  };

  render() {
    return <CreateTournament {...this.state} onSubmit={this._onSubmit} />;
  }
}

export default CreateTournamentContainer;
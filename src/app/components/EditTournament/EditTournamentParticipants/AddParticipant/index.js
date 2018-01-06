// @flow
import React, { Component } from 'react';

import AddParticipant from './component';
import { createParticipant } from '../../../../api/participant';
import type { Participant } from '../../../../../models/participant';

type Props = {
  tournamentId: string
}
type State = {
  isLoading: boolean,

  addedSuccessfully: boolean,

  isValidParticipant: boolean,
  isValidName: boolean,
  isValidRole: boolean
}

class AddParticipantContainer extends Component<Props, State> {
  state = {
    isLoading: false,

    addedSuccessfully: false,

    isValidParticipant: true,
    isValidName: true,
    isValidRole: true
  }
  _onSubmit = async (participant: Participant) => {
    this.setState({ isLoading: true });

    try {
      const validation =
        await createParticipant(this.props.tournamentId, participant);

      this.setState({
        isLoading: false,
        addedSuccessfully: true,
        isValidParticipant: true,
        ...validation
      });
    } catch (validation) {
      this.setState({
        isLoading: false,
        addedSuccessfully: false,
        isValidParticipant: false,
        ...validation
      });
    }
  }

  render() {
    return <AddParticipant {...this.state} onSubmit={this._onSubmit} />;
  }
}

export default AddParticipantContainer;
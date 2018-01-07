// @flow
import React, { Component } from 'react';
import ObjectId from 'bson-objectid';

import AddParticipant from './component';
import type { State as ComponentState } from './component';
import { createParticipant } from '../../../../api/participant';

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
  _onSubmit = async (state: ComponentState) => {
    this.setState({ isLoading: true });
    const participant = { _id: ObjectId.generate(), ...state };
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
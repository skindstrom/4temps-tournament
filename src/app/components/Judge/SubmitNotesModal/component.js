// @flow

import React, { PureComponent } from 'react';
import {
  Modal,
  ModalActions,
  Button,
  ModalContent,
  ModalHeader,
  Dimmer,
  Loader,
  Message
} from 'semantic-ui-react';
// $FlowFixMe
import NoteTable from '../NoteTable';

export type StateProps = {
  tournamentId: string,
  notes: Array<JudgeNote>,
  isLoading: boolean,
  didSubmit: boolean,
  successfulSubmit: boolean
};

export type DispatchProps = {
  onSubmit: (tournamentId: string, notes: Array<JudgeNote>) => void
};

type Props = StateProps & DispatchProps;

class SubmitNotesModal extends PureComponent<Props> {
  _onSubmit = () => {
    this.props.onSubmit(this.props.tournamentId, this.props.notes);
  };

  _failureMessage() {
    return (
      <Message
        negative
        header='Failed to submit scores!'
        content='Please try again.'
      />
    );
  }

  _didFail(): boolean {
    return (
      this.props.didSubmit &&
      !this.props.successfulSubmit &&
      !this.props.isLoading
    );
  }

  render() {
    const failureMessage = this._didFail() ? this._failureMessage() : null;
    return (
      <Modal trigger={<Button>Vérifier les notes</Button>}>
        <Dimmer active={this.props.isLoading}>
          <Loader>Submitting</Loader>
        </Dimmer>
        <ModalHeader>Vérifier les notes</ModalHeader>
        {failureMessage}
        <ModalContent>
          <NoteTable />
        </ModalContent>
        <ModalActions>
          <Button color="green" type="submit" onClick={this._onSubmit}>
            Valider les notes
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}


export default SubmitNotesModal;

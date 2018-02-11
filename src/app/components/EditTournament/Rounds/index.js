// @flow

import React from 'react';
import { Button, Container, Modal } from 'semantic-ui-react';
import type { RouterHistory } from 'react-router-dom';

import CreateRound from './CreateRound';
import ListRounds from './ListRounds';

type Props = {
  tournamentId: string,
  history: RouterHistory
};

function EditTournamentRounds({ tournamentId, history }: Props) {
  return (
    <Container>
      <Modal defaultOpen={false} trigger={<Button>Add round</Button>}>
        <Modal.Header>Add round</Modal.Header>
        <Modal.Content>
          <CreateRound tournamentId={tournamentId} />
        </Modal.Content>
      </Modal>
      <ListRounds tournamentId={tournamentId} history={history} />
    </Container>
  );
}

export default EditTournamentRounds;

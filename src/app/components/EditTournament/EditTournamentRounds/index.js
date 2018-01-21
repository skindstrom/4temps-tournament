// @flow

import React from 'react';
import { Button, Container, Modal } from 'semantic-ui-react';

import CreateRound from './CreateRound';
import ListRounds from './ListRounds';



function EditTournamentRounds({ tournamentId }: { tournamentId: string }) {
  return (
    <Container>
      <Modal defaultOpen={false} trigger={<Button>Add round</Button>}>
        <Modal.Header>Add round</Modal.Header>
        <Modal.Content>
          <CreateRound tournamentId={tournamentId} />
        </Modal.Content>
      </Modal>
      <ListRounds tournamentId={tournamentId} />
    </Container>
  );
}

export default EditTournamentRounds;
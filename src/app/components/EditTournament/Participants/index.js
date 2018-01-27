// @flow

import React from 'react';
import { Container, Header, Divider } from 'semantic-ui-react';

import ListParticipants from './ListParticipants';
import CreateParticipant from './CreateParticipant';

type Props = {
  tournamentId: string
}

export default function EditTournamentParticipants(props: Props) {
  return (
    <Container>
      <Header as='h1'>Participants</Header>
      <ListParticipants {...props} />
      <Divider />
      <Header as='h2'>Add participant</Header>
      <CreateParticipant {...props} />
    </Container>);
}
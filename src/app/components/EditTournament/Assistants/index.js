// @flow

import React from 'react';
import { Container, Divider, Header } from 'semantic-ui-react';
import ListAssistants from './ListAssistants';
import CreateAssistant from './CreateAssistant';

type Props = {
  tournamentId: string
};

function Assistants(props: Props) {
  return (
    <Container>
      <Header as="h1">Assistants</Header>
      <ListAssistants {...props} />
      <Divider />
      <Header as="h2">Add Assistant</Header>
      <CreateAssistant {...props} />
    </Container>
  );
}

export default Assistants;

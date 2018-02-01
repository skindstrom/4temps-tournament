// @flow

import React from 'react';
import {Container, Divider, Header} from 'semantic-ui-react';
import ListJudges from './ListJudges';
import CreateJudge from './CreateJudge';

type Props = {
  tournamentId: string
}

function Judges(props: Props) {
  return (
    <Container>
      <Header as='h1'>Judges</Header>
      <ListJudges {...props} />
      <Divider />
      <Header as='h2'>Add judge</Header>
      <CreateJudge {...props} />
    </Container>
  );
}

export default Judges;

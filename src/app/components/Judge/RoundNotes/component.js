// @flow
import React from 'react';
import {
  Grid,
  Button,
  GridColumn,
  GridRow,
  Header,
  Container
} from 'semantic-ui-react';

type Props = {
  pairs: Array<Pair>,
}
function RoundNotes(props: Props) {
  const pairs = Array.from(Array(props.pairs.length).keys()).map(i => {
    return (
      <GridColumn key={i}>
        <Button>
          {i + 1}
        </Button>
      </GridColumn>
    );
  });
  return (
    <Container>
      <Grid columns={props.pairs.length} divded>
        <GridRow>
          <Header as='h3'>
            Pairs
          </Header>
        </GridRow>
        <GridRow>
          {pairs}
        </GridRow>
      </Grid>
    </Container>
  );
}

export default RoundNotes;
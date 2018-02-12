// @flow
import React, { Component } from 'react';
import  {
  Grid,
  GridColumn,
  GridRow,
  Header,
  Container,
  FormField,
  Form,
  Radio,
  Icon
} from 'semantic-ui-react';

type Props = {
  pair: Pair,
  dance: Dance,
  criteria: Array<RoundCriterion>
}

class Notes extends Component<Props> {


  getFollowerCriteria(): Array<RoundCriterion> {
    return this.getCriteria((c) => c.type === 'one' || c.type === 'follower');
  }

  getLeaderCriteria(): Array<RoundCriterion> {
    return this.getCriteria((c) => c.type === 'one' || c.type === 'leader');
  }

  getCoupleCriteria(): Array<RoundCriterion> {
    return this.getCriteria((c) => c.type === 'both');
  }

  getCriteria(condition: (RoundCriterion) => boolean): Array<RoundCriterion> {
    return this.props.criteria.filter(condition);
  }

  getAlternatives(criterion: RoundCriterion) {
    return [...Array(criterion.maxValue + 1).keys()].map(i => {
      return (
        <FormField key={i}>
          <Radio label={'' + (i + criterion.minValue)} />
        </FormField>
      );
    });
  }

  buildNotes(criteria: Array<RoundCriterion>) {
    const notes = criteria.map(c => {
      return (
        <Form key={c.name}>
          <FormField>
            {c.name} <Icon name='info circle' />:
          </FormField>
          {this.getAlternatives(c)}
        </Form>
      );
    });
    return (
      <GridRow>
        {notes}
      </GridRow>
    );
  }

  render() {
    return (
      <Container>
        <Grid padded>
          <GridRow columns={3}>
            <GridColumn key='follower'>
              <GridRow>
                <Header>
                  Follower
                </Header>
              </GridRow>
              {this.buildNotes(this.getFollowerCriteria())}
            </GridColumn>
            <GridColumn key='couple'>
              <GridRow>
                <Header>
                  Couple
                </Header>
              </GridRow>
              {this.buildNotes(this.getCoupleCriteria())}
            </GridColumn>
            <GridColumn key='leader'>
              <GridRow>
                <Header>
                  Leader
                </Header>
              </GridRow>
              {this.buildNotes(this.getLeaderCriteria())}
            </GridColumn>
          </GridRow>
        </Grid>
      </Container>
    );
  }
}

export default Notes;
// @flow
import React, { Component } from 'react';
import {
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

type PairViewModel = {
  leader: Participant,
  follower: Participant
};

type Props = {
  criteria: Array<RoundCriterion>,
  pair: PairViewModel
};

class Notes extends Component<Props> {
  getFollowerCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'one' || c.type === 'follower');
  }

  getLeaderCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'one' || c.type === 'leader');
  }

  getCoupleCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'both');
  }

  getCriteria(condition: RoundCriterion => boolean): Array<RoundCriterion> {
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
            {c.name} <Icon name="info circle" />:
          </FormField>
          {this.getAlternatives(c)}
        </Form>
      );
    });
    return <GridRow>{notes}</GridRow>;
  }

  render() {
    let nbGridColumns = 0;

    if (this.getFollowerCriteria().length > 0) {
      nbGridColumns += 1;
    }
    if (this.getCoupleCriteria().length > 0) {
      nbGridColumns += 1;
    }
    if (this.getLeaderCriteria().length > 0) {
      nbGridColumns += 1;
    }

    return (
      <Container>
        <Grid padded>
          <GridRow columns={nbGridColumns}>
            {this.getFollowerCriteria().length > 0 ? (
              <GridColumn key="follower">
                <GridRow>
                  <Header>
                    Follower {this.props.pair.follower.attendanceId}
                  </Header>
                </GridRow>
                {this.buildNotes(this.getFollowerCriteria())}
              </GridColumn>
            ) : null}
            {this.getCoupleCriteria().length > 0 ? (
              <GridColumn key="couple">
                <GridRow>
                  <Header>
                    Couple L{this.props.pair.leader.attendanceId} - F{
                      this.props.pair.follower.attendanceId
                    }
                  </Header>
                </GridRow>
                {this.buildNotes(this.getCoupleCriteria())}
              </GridColumn>
            ) : null}
            {this.getLeaderCriteria().length > 0 ? (
              <GridColumn key="leader">
                <GridRow>
                  <Header>Leader {this.props.pair.leader.attendanceId}</Header>
                </GridRow>
                {this.buildNotes(this.getLeaderCriteria())}
              </GridColumn>
            ) : null}
          </GridRow>
        </Grid>
      </Container>
    );
  }
}

export default Notes;

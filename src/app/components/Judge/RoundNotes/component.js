// @flow
import React, { Component } from 'react';
import {
  Grid,
  Button,
  GridColumn,
  GridRow,
  Header,
  Container
} from 'semantic-ui-react';
import NotesContainer from './Notes';

type Props = {
  pairs: Array<Pair>
};

class RoundNotes extends Component<Props> {
  // $FlowFixMe
  state: { activePair: Pair } = {
    activePair: this.props.pairs[0]
  };

  onClick(pair: Pair) {
    // $FlowFixMe
    this.setState({ activePair: pair });
  }
  arrangeUpperLayer() {
    const condition = (index: number) => index % 2 !== 0;
    return this.conditionalLayer(condition);
  }
  arrangeLowerLayer() {
    const condition = (index: number) => index % 2 === 0;
    return this.conditionalLayer(condition);
  }
  conditionalLayer(condition: (index: number) => boolean) {
    return Array.from(Array(this.props.pairs.length).keys()).map(i => {
      if (condition(i)) {
        const pair = this.props.pairs[i];
        return (
          <GridColumn key={i} textAlign="center">
            <Button
              toggle
              active={this.isActive(pair)}
              onClick={() => this.onClick(pair)}
            >
              {i + 1}
            </Button>
          </GridColumn>
        );
      } else {
        return <GridColumn key={i} />;
      }
    });
  }
  isActive(pair: Pair): boolean {
    return (
      this.state.activePair.follower === pair.follower &&
      this.state.activePair.leader === pair.leader
    );
  }
  render() {
    const upperPairs = this.arrangeUpperLayer();
    const lowerPairs = this.arrangeLowerLayer();
    return (
      <Container>
        <Grid padded>
          <GridRow>
            <Header as="h3">Pairs</Header>
          </GridRow>
          <GridRow columns={this.props.pairs.length}>{upperPairs}</GridRow>
          <GridRow columns={this.props.pairs.length}>{lowerPairs}</GridRow>
          <GridRow>
            <NotesContainer pair={this.state.activePair} />
          </GridRow>
        </Grid>
      </Container>
    );
  }
}

export default RoundNotes;

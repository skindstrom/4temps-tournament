// @flow
import React, { Component } from 'react';
import {
  Grid,
  Button,
  GridColumn,
  GridRow,
  Header,
  Form,
  FormGroup,
  Tab,
  Container
} from 'semantic-ui-react';
import NotesContainer from './Notes';

type PairViewModel = {
  leader: Participant,
  follower: Participant
};

type Props = {
  pairs: Array<PairViewModel>
};

type State = {
  activePair: PairViewModel
};

class RoundNotes extends Component<Props, State> {
  state = {
    activePair: this.props.pairs[0]
  };

  onClick(pair: PairViewModel) {
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
  createPanes() {
    return Array.from(Array(this.props.pairs.length).keys()).map(i => {
      const pair = this.props.pairs[i];
      return (
        {menuItem: 'L' + pair.leader.attendanceId + ' - F' + pair.follower.attendanceId, render: () =>
          <Tab.Pane>
            <NotesContainer pair={pair} />
          </Tab.Pane>}
      );
    });
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
              L{pair.leader.attendanceId} - F{pair.follower.attendanceId}
            </Button>
          </GridColumn>
        );
      } else {
        return <GridColumn key={i} />;
      }
    });
  }
  isActive(pair: PairViewModel): boolean {
    return (
      this.state.activePair.follower === pair.follower &&
      this.state.activePair.leader === pair.leader
    );
  }
  render() {
    const upperPairs = this.arrangeUpperLayer();
    const lowerPairs = this.arrangeLowerLayer();
    const panes = this.createPanes();

    return (
      <Container>
        <Grid padded>
          <GridRow>
            <Header as="h3">Pairs</Header>
          </GridRow>
          <GridRow columns={this.props.pairs.length}>{upperPairs}</GridRow>
          <GridRow columns={this.props.pairs.length}>{lowerPairs}</GridRow>
          <GridRow>
            <Header as="h3">Notation</Header>
          </GridRow>
          <GridRow>
            <Form>
              <FormGroup>
                <Tab panes={panes} />
              </FormGroup>
              <Button type="submit" onClick={this.onSubmit}>
                Submit
              </Button>
            </Form>
          </GridRow>
        </Grid>
      </Container>
    );
  }
} //<NotesContainer pair={this.state.activePair} />

export default RoundNotes;

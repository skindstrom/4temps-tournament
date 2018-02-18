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
  FormField,
  FormRadio,
  Tab,
  Icon,
  Container
} from 'semantic-ui-react';
import NotesContainer from './Notes';

type PairViewModel = {
  leader: Participant,
  follower: Participant
};

type Props = {
  criteria: Array<RoundCriterion>,
  pairs: Array<PairViewModel>
};

type State = {
  activePair: PairViewModel
};

class RoundNotes extends Component<Props, State> {
  state = {
    activeIndex: 0,                                  // index of the tab
    activePair: this.props.pairs[0],
    noteStorage: this.createEmptyNotesMatrix()
  };
  handleTabChange = (e, { activeIndex }) => {
    /** When the tab changes, change the activePair. **/
    this.setState({ activeIndex: activeIndex })
    this.setState({ activePair: this.props.pairs[activeIndex] });
  }
  handlePairChange(i) {
    /** When the active pair changes, change the tab. **/
    // $FlowFixMe
    this.setState({ activeIndex: i })
    this.setState({ activePair: this.props.pairs[i] });
  }
  isActive(pair: PairViewModel): boolean {
    return (
      this.state.activePair.follower === pair.follower &&
      this.state.activePair.leader === pair.leader
    );
  }
  createEmptyNotesMatrix() {
    /**the matrix of scores per couples. works only for couples criteria!!!**/
    // FixMe
    return Array(this.props.pairs.length).fill().map(()=>Array(this.props.criteria.length).fill())
  }

/*************
 * PAIRS ROW *
 *************/

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
              onClick={() => this.handlePairChange(i)}
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

  /************
   * TABS ROW *
   ************/
  createPanes() {
    return Array.from(Array(this.props.pairs.length).keys()).map(i => {
      const pair = this.props.pairs[i];
      return (
        {menuItem: 'L' + pair.leader.attendanceId + ' - F' + pair.follower.attendanceId, render: () =>
          <Tab.Pane>
            <FormGroup>
              <FormField>
                Hey <Icon name="info circle" />
              </FormField>
              <FormRadio label={0}/>
              <FormRadio label={2}/>
              <FormRadio label={1}/>
            </FormGroup>
          </Tab.Pane>}
      );
    });
  } //<NotesContainer pair={pair} />


  /**********
   * RENDER *
   **********/
  render() {
    const upperPairs = this.arrangeUpperLayer();
    const lowerPairs = this.arrangeLowerLayer();
    const panes = this.createPanes();
    const activeIndex = this.state.activeIndex;

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
                <Tab panes={panes} activeIndex={activeIndex} onTabChange={this.handleTabChange}/>
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

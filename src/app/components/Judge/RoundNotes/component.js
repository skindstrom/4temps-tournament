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
  Modal,
  Table,
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
    coupleNoteStorage: this.createEmptyNotesMatrix(this.getCoupleCriteria().length),
    leaderNoteStorage: this.createEmptyNotesMatrix(this.getLeaderCriteria().length),
    followerNoteStorage: this.createEmptyNotesMatrix(this.getFollowerCriteria().length)
  };
  handleTabChange = (e, { activeIndex }) => {
    /** When the tab changes, change the activePair. **/
    this.setState({ activeIndex: activeIndex });
    this.setState({ activePair: this.props.pairs[activeIndex] });
  }
  handlePairChange(i) {
    /** When the active pair changes, change the tab. **/
    // $FlowFixMe
    this.setState({ activeIndex: i });
    this.setState({ activePair: this.props.pairs[i] });
  }
  isActive(pair: PairViewModel): boolean {
    return (
      this.state.activePair.follower === pair.follower &&
      this.state.activePair.leader === pair.leader
    );
  }
  createEmptyNotesMatrix(len) {
    /**the matrix of scores per couples. works only for couples criteria!!!**/
    // FixMe
    if (len > 0) {
      return Array(this.props.pairs.length).fill().map(()=>Array(len).fill());
    } else {
      return null;
    }
  }

  /****************
   * GET CRITERIA *
   ****************/

  getFollowerCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'one');
  }

  getLeaderCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'one');
  }

  getCoupleCriteria(): Array<RoundCriterion> {
    return this.getCriteria(c => c.type === 'both');
  }

  getCriteria(condition: RoundCriterion => boolean): Array<RoundCriterion> {
    return this.props.criteria.filter(condition);
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
        let bcolor = 'yellow'
        if (this.state.coupleNoteStorage[i].some(function (el) {return el == null;})) {
          bcolor = 'red'
        } else {
          bcolor = 'green'
        }
        return (
          <GridColumn key={i} textAlign="center">
            <Button
              color={bcolor}
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
          <GridRow columns={3}>
            {this.getFollowerCriteria().length > 0 ? (
              <GridColumn key="follower">
                <GridRow>
                  <Header>
                    Noter la cavalière
                  </Header>
                </GridRow>
                {this.buildNotes(this.getFollowerCriteria(), 'follow')}
                <GridRow>
                  Total : {this.computeNote(i, 'follow')}
                </GridRow>
              </GridColumn>
            ) : null}
            {this.getCoupleCriteria().length > 0 ? (
              <GridColumn key="couple">
                <GridRow>
                  <Header>
                    Noter le couple
                  </Header>
                </GridRow>
                {this.buildNotes(this.getCoupleCriteria(), 'couple')}
                <GridRow>
                  Total : {this.computeNote(i, 'couple')}
                </GridRow>
              </GridColumn>
            ) : null}
            {this.getLeaderCriteria().length > 0 ? (
              <GridColumn key="leader">
                <GridRow>
                  <Header>Noter le cavalier</Header>
                </GridRow>
                {this.buildNotes(this.getLeaderCriteria(), 'lead')}
                <GridRow>
                  Total : {this.computeNote(i, 'lead')}
                </GridRow>
              </GridColumn>
            ) : null}
          </GridRow>
          </Tab.Pane>}
      );
    });
  }

  buildNotes(criteria: Array<RoundCriterion>, whoseCriteria) {
    const notes = criteria.map((c, index) => {
      return (
        <FormGroup>
          <FormField>
            {c.name}<Icon name="info circle" />
          </FormField>
          {this.getAlternatives(c, index, whoseCriteria)}
        </FormGroup>
      );
    });
    return <GridRow>{notes}</GridRow>;
  }

  getAlternatives(criterion: RoundCriterion, index, whoseCriteria) {
    return [...Array(criterion.maxValue + 1).keys()].map(i => {
      if (whoseCriteria=='couple') {
        return (
          <FormRadio label={'' + (i + criterion.minValue)} value={'' + (i + criterion.minValue)} checked={this.state.coupleNoteStorage[this.state.activeIndex][index] === '' + (i + criterion.minValue)} onChange={(e, { value }) => this.handleRadioChange(e, { value }, index, whoseCriteria)}/>
        );
      } else if (whoseCriteria=='lead') {
        return (
          <FormRadio label={'' + (i + criterion.minValue)} value={'' + (i + criterion.minValue)} checked={this.state.leaderNoteStorage[this.state.activeIndex][index] === '' + (i + criterion.minValue)} onChange={(e, { value }) => this.handleRadioChange(e, { value }, index, whoseCriteria)}/>
        );
      } else if (whoseCriteria=='follow') {
        return (
          <FormRadio label={'' + (i + criterion.minValue)} value={'' + (i + criterion.minValue)} checked={this.state.followerNoteStorage[this.state.activeIndex][index] === '' + (i + criterion.minValue)} onChange={(e, { value }) => this.handleRadioChange(e, { value }, index, whoseCriteria)}/>
        );
      } else {
        console.log("not implemented 1")
        return null
      }
    });
  }

  handleRadioChange = (e, { value }, index, whoseCriteria) => {
    if (whoseCriteria=='couple') {
      const newStorage = JSON.parse(JSON.stringify(this.state.coupleNoteStorage));
      newStorage[this.state.activeIndex][index] = value;
      this.setState({coupleNoteStorage: newStorage});
    } else if (whoseCriteria=='lead') {
      const newStorage = JSON.parse(JSON.stringify(this.state.leaderNoteStorage));
      newStorage[this.state.activeIndex][index] = value;
      this.setState({leaderNoteStorage: newStorage});
    } else if (whoseCriteria=='follow') {
      const newStorage = JSON.parse(JSON.stringify(this.state.followerNoteStorage));
      newStorage[this.state.activeIndex][index] = value;
      this.setState({followerNoteStorage: newStorage});
    } else {
      console.log("not implemented 2")
      return null
    }
    // TODO add temp save
  }

  computeNote(coupleNb, whoseCriteria) {
    let sum = 0;
    if (whoseCriteria == 'couple' && this.state.coupleNoteStorage!=null) {
      for (var i = 0; i < this.state.coupleNoteStorage[coupleNb].length; i++) {
        sum += parseInt(this.state.coupleNoteStorage[coupleNb][i])
      }
    } else if (whoseCriteria == 'lead' && this.state.leaderNoteStorage!=null) {
      for (var i = 0; i < this.state.leaderNoteStorage[coupleNb].length; i++) {
        sum += parseInt(this.state.leaderNoteStorage[coupleNb][i])
      }
    } else if (whoseCriteria == 'follow' && this.state.followerNoteStorage!=null) {
      for (var i = 0; i < this.state.followerNoteStorage[coupleNb].length; i++) {
        sum += parseInt(this.state.followerNoteStorage[coupleNb][i])
      }
    } else {
      null
    }

    if (sum==null) {
      sum = 0;
    }

    return sum
  }

  /**********
   * MODAL *
   **********/

  notesTable() {
    // TODO array of couples !!!

    const index=0;
    return(
      <Table.Row>
        <Table.Cell>L {this.props.pairs[index].leader.attendanceId} - F{this.props.pairs[index].follower.attendanceId}</Table.Cell>
        <Table.Cell>{this.computeNote(index,'couple')}</Table.Cell>
        <Table.Cell>{this.computeNote(index,'follow')}</Table.Cell>
        <Table.Cell>{this.computeNote(index,'lead')}</Table.Cell>
      </Table.Row>
    )
  }

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
            <Header as="h3">Placements des couples</Header>
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

              <Modal trigger={<Button>Vérifier les notes</Button>}>
                <Modal.Header>Vérifier les notes</Modal.Header>
                <Modal.Content>
                  <Table definition>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Couple</Table.HeaderCell>
                        <Table.HeaderCell>Cavalière</Table.HeaderCell>
                        <Table.HeaderCell>Cavalier</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {this.notesTable()}
                    </Table.Body>
                  </Table>
                </Modal.Content>
                <Modal.Actions>
                  <Button color='green' type="submit" onClick={this.onSubmit}>
                    Valider les notes
                  </Button>
                </Modal.Actions>
              </Modal>
            </Form>
          </GridRow>
        </Grid>
      </Container>
    );
  }
} //<NotesContainer pair={this.state.activePair} />

export default RoundNotes;

// @flow

import React, { Component } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  Button,
  Icon,
  Header,
  Card,
  Container,
  Progress,
  Accordion,
  SyntheticEvent,
  Modal
} from 'semantic-ui-react';
import './styles.css';
import CreateRound from '../CreateRound';

type State = {
  activeIndex: number
};

type Props = {
  tournamentId: string,
  rounds: Array<Round>,
  deleteRound: (id: string) => void,
  startRound: (id: string) => void,
  onClick: (id: string) => void,
  nextRound: ?string
};

class RoundList extends Component<Props, State> {
  state = {
    activeIndex: -1
  }
  handleClick = (e: SyntheticEvent, titleProps: Object) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  _renderItem = (round: Round) => {
    return (
      <TableRow key={round.id}>
        <TableCell selectable onClick={() => this.props.onClick(round.id)}>
          {round.name}
        </TableCell>
        <TableCell textAlign="right">
          {round.id === this.props.nextRound &&
            !round.active && (
              <Button
                size="tiny"
                floated="right"
                onClick={() => this.props.startRound(round.id)}
              >
                Start round
              </Button>
            )}
        </TableCell>
        <TableCell textAlign="right">
          {!(round.active || round.finished) && (
            <Button
              size="tiny"
              floated="right"
              onClick={() => this.props.deleteRound(round.id)}
            >
              Delete
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  _hasActiveRound = () => {
    return this.props.rounds.filter(r => r.active).length > 0;
  }

  _getActiveRound = (): Round => {
    return this.props.rounds.filter(r => r.active)[0];
  }

  _hasActiveDance = (round: Round) => {
    return round.groups.reduce((acc, g) => [...acc, ...g.dances], [])
      .filter(d => d.active).length > 0;
  }

  _getFinishedDances = (activeRound: Round) => {
    return activeRound.groups.reduce((acc, g) => [...acc, ...g.dances], [])
      .filter(d => d.finished).length;
  }

  _getUnfinishedDances = (activeRound: Round) => {
    return activeRound.groups.reduce((acc, g) => [...acc, ...g.dances], [])
      .filter(d => !d.finished).length;
  }

  _getPastRounds = () => {
    return this.props.rounds.filter(r => r.finished);
  }

  _getUpcomingRounds = () => {
    return this.props.rounds.filter(r => !(r.active || r.finished));
  }

  _renderActiveRound = () => {
    const activeRound = this._getActiveRound();
    const finishedDances = this._getFinishedDances(activeRound);
    const unfinishedDances = this._getUnfinishedDances(activeRound);
    const percent = (finishedDances/(finishedDances + unfinishedDances)) * 100;
    return(
      <Container styleName='pad'>
        <Header as='h2'>Current Round</Header>
        <Card onClick={() => this.props.onClick(activeRound.id)}>
          <Card.Content>
            <Card.Header>
              {activeRound.name}
            </Card.Header>
          </Card.Content>
          <Card.Content extra>
            {this._hasActiveDance(activeRound) ?
              <Progress percent={percent} success>
                {finishedDances}/{unfinishedDances + finishedDances}
                dances finished!
              </Progress> :
              <Progress percent={percent} warning>
                {finishedDances}/{unfinishedDances + finishedDances}
                dances finished!
              </Progress>
            }
          </Card.Content>
        </Card>
      </Container>
    );
  }

  _renderUpcomingRounds = () => {
    const upcomingRounds = this._getUpcomingRounds();
    return (
      <Table fixed unstackable basic="very" size="large">
        <Table.Body>
          {upcomingRounds.map(r => this._renderItem(r))}
        </Table.Body>
      </Table>
    );
  }

  _renderPastRounds = () => {
    const pastRounds = this._getPastRounds();
    return (
      <Table fixed unstackable basic="very">
        <Table.Body>
          {pastRounds.map(r => this._renderItem(r))}
        </Table.Body>
      </Table>
    );
  }

  _renderRounds = () => {
    return (
      <Container styleName='pad'>
        <Accordion styled>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Upcoming Rounds
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this._renderUpcomingRounds()}
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Past Rounds
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            {this._renderPastRounds()}
          </Accordion.Content>
        </Accordion>
      </Container>
    );
  }

  _renderCreateRound = () => {
    return (
      <Container styleName='pad'>
        <Modal defaultOpen={false} trigger={<Button>Add round</Button>}>
          <Modal.Header>Add round</Modal.Header>
          <Modal.Content>
            <CreateRound tournamentId={this.props.tournamentId} />
          </Modal.Content>
        </Modal>
      </Container>
    );
  }

  render() {
    return (
      <Container>
        {this._hasActiveRound() && (
          this._renderActiveRound()
        )}
        {this._renderCreateRound()}
        {this._renderRounds()}
      </Container>
    );
  }
}

export default RoundList;

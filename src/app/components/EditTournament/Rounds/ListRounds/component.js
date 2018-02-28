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
          {!(round.active || round.finished) && (
          <TableCell textAlign="right">
            <Button
              size="tiny"
              floated="right"
              onClick={() => this.props.deleteRound(round.id)}
            >
              Delete
            </Button>
          </TableCell>
          )}
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
    return this.props.rounds.filter(r =>
      !(r.active || r.finished) && r.id != this.props.nextRound
    );
  }

  _renderActiveRound = () => {
    const activeRound = this._getActiveRound();
    const finishedDances = this._getFinishedDances(activeRound);
    const total = activeRound.danceCount * activeRound.groups.length;
    const percent = (finishedDances/(total)) * 100 || 0;
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
                {finishedDances}/{total} dances finished!
              </Progress> :
              <Progress percent={percent} warning>
                {finishedDances}/{total} dances finished!
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
          <Accordion.Title
            active={this.state.activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            Upcoming Rounds
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {this._renderUpcomingRounds()}
          </Accordion.Content>
          <Accordion.Title
            active={this.state.activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
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

  _hasNextRound = () => {
    return this.props.nextRound != null;
  }

  _getNextRound = () => {
    return this.props.rounds.find(r => r.id === this.props.nextRound);
  }

  _renderNextRound = () => {
    const nextRound = this._getNextRound();
    return (
      <Container styleName='pad'>
        <Header as='h2'>Next Round</Header>
        <Card>
          <Card.Content>
            <Card.Header onClick={() => this.props.onClick(nextRound.id)}>
              {nextRound.name}
            </Card.Header>
          </Card.Content>
          <Card.Content extra>
            <Button basic color='green' onClick={() => this.props.startRound(nextRound.id)}>Start Round</Button>
            <Button basic color='red' onClick={() => this.props.deleteRound(nextRound.id)}>Delete</Button>
          </Card.Content>
        </Card>
      </Container>
    )
  }

  render() {
    return (
      <Container>
        {this._hasActiveRound() && (
          this._renderActiveRound()
        )}
        {this._hasNextRound() && !this._hasActiveRound() && (
          this._renderNextRound()
        )}
        {this._renderCreateRound()}
        {this._renderRounds()}
      </Container>
    );
  }
}

export default RoundList;

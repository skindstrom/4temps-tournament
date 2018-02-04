// @flow

import React, { Component } from 'react';
import {
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Icon,
  Button
} from 'semantic-ui-react';

type Props = {
  rounds: Array<Round>,
  deleteRound: (id: string) => void,
  startRound: (id: string) => void,
  nextRound: ?string
};

class RoundList extends Component<Props> {

  _renderItem = (round: Round) => {
    return (
      <TableRow key={round.id}>
        <TableCell>
          {round.name}
        </TableCell>
        <TableCell>
          {round.danceCount}
        </TableCell>
        <TableCell>
          {round.minPairCount}
        </TableCell>
        <TableCell>
          {round.maxPairCount}
        </TableCell>
        <TableCell textAlign='right'>
          {round.id === this.props.nextRound && !round.active &&
            <Button
              size='tiny'
              floated='right'
              onClick={() => this.props.startRound(round.id)}
            >
              Start round
            </Button>
          }
          {round.active && 'Started!'}
        </TableCell>
        <TableCell textAlign='right'>
          <Icon
            name='delete'
            onClick={() => this.props.deleteRound(round.id)}
          />
        </TableCell>
      </TableRow>
    );
  }

  render() {
    return (
      <Table fixed>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Dance count</TableHeaderCell>
            <TableHeaderCell>Minimum amount of pairs</TableHeaderCell>
            <TableHeaderCell>Maximum amount of pairs</TableHeaderCell>
            <TableHeaderCell />
            <TableHeaderCell />
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.rounds.map(round => this._renderItem(round))}
        </TableBody>
      </Table>
    );

  }
}

export default RoundList;

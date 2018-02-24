// @flow

import React, { Component } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button
} from 'semantic-ui-react';

type Props = {
  rounds: Array<Round>,
  deleteRound: (id: string) => void,
  startRound: (id: string) => void,
  onClick: (id: string) => void,
  nextRound: ?string
};

class RoundList extends Component<Props> {
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
          {(round.finished) && (
            <span floated="right">Round Finished</span>
          )}
          {(round.active) && (
            <span floated="right">Round Started!</span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  render() {
    return (
      <Table fixed unstackable basic="very">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
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

// @flow

import React from 'react';
import {
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Icon
} from 'semantic-ui-react';

type Props = {
  rounds: Array<Round>,
  deleteFromRounds: (id: string, rounds: Array<Round>) => void
}

function RoundList({ rounds, deleteFromRounds }: Props) {
  return (
    <Table fixed>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Dance count</TableHeaderCell>
          <TableHeaderCell>Minimum amount of pairs</TableHeaderCell>
          <TableHeaderCell>Maximum amount of pairs</TableHeaderCell>
          <TableHeaderCell />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rounds.map(round =>
          (<RoundListItem
            key={round._id}
            onClickDelete={() => deleteFromRounds(round._id, rounds)}
            {...round}
          />))}
      </TableBody>
    </Table>
  );
}

function RoundListItem(
  { name, danceCount, minPairCount, maxPairCount, onClickDelete }: Round & {
    onClickDelete: () => void
  }) {
  return (
    <TableRow>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {danceCount}
      </TableCell>
      <TableCell>
        {minPairCount}
      </TableCell>
      <TableCell>
        {maxPairCount}
      </TableCell>
      <TableCell textAlign='right'>
        <Icon name='delete' onClick={onClickDelete} />
      </TableCell>
    </TableRow>
  );
}

export default RoundList;

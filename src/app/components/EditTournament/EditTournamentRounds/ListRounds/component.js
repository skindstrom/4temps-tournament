// @flow

import React from 'react';
import {
  Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell
} from 'semantic-ui-react';

type Props = {
  rounds: Array<Round>
}

function RoundList({ rounds }: Props) {
  return (
    <Table fixed>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Dance count</TableHeaderCell>
          <TableHeaderCell>Minimum amount of pairs</TableHeaderCell>
          <TableHeaderCell>Maximum amount of pairs</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rounds.map(round =>
          (<RoundListItem
            key={round._id}
            {...round}
          />))}
      </TableBody>
    </Table>
  );
}

function RoundListItem(
  { name, danceCount, minPairCount, maxPairCount }: Round) {
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
    </TableRow>
  );
}

export default RoundList;
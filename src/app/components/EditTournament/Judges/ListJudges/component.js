// @flow

import React from 'react';
import {
  Table, TableHeader, TableHeaderCell,
  TableBody, TableCell, TableRow
} from 'semantic-ui-react';

type JudgeViewModel = Judge & {
  accessKey: string
}


function ListJudges({judges}: {judges: Array<JudgeViewModel>}) {
  return (
    <Table unstackable>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>
            Name
          </TableHeaderCell>
          <TableHeaderCell>
            Access Key
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {judges.map(j => (
          <TableRow key={j.id}>
            <TableCell>{j.name}</TableCell>
            <TableCell>{j.accessKey}</TableCell>
          </TableRow>))}
      </TableBody>
    </Table>
  );
}

export default ListJudges;

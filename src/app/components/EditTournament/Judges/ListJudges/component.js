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
    <Table>
      <TableHeader>
        <TableHeaderCell>
          Name
        </TableHeaderCell>
        <TableHeaderCell>
          Access Key
        </TableHeaderCell>
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

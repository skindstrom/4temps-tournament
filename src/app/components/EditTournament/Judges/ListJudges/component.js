// @flow

import React from 'react';
import {
  Table,
  TableBody, TableCell, TableRow
} from 'semantic-ui-react';


function ListJudges({judges}: {judges: Array<Judge>}) {
  return (
    <Table>
      <TableBody>
        {judges.map(j => (
          <TableRow key={j.id}>
            <TableCell>{j.name}</TableCell>
          </TableRow>))}
      </TableBody>
    </Table>
  );
}

export default ListJudges;

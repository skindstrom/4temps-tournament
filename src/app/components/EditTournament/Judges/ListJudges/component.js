// @flow

import React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableRow
} from 'semantic-ui-react';

type JudgeViewModel = Judge & {
  accessKey: string
};

function ListJudges({ judges }: { judges: Array<JudgeViewModel> }) {
  return (
    <Table unstackable basic="very">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Access Key</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {judges.map(j => (
          <TableRow key={j.id}>
            <TableCell>{j.name}</TableCell>
            <TableCell>{typeToDisplayName(j.type)}</TableCell>
            <TableCell>{j.accessKey}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function typeToDisplayName(type: JudgeType): string {
  if (type === 'normal') {
    return 'Normal';
  } else if (type === 'sanctioner') {
    return 'Sanctioner';
  } else {
    return 'Unknown';
  }
}

export default ListJudges;

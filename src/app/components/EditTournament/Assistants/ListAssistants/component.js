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

type AssistantViewModel = Assistant & {
  accessKey: string
};

function ListAssistants({
  assistants
}: {
  assistants: Array<AssistantViewModel>
}) {
  return (
    <Table unstackable basic="very">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Access Key</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assistants.map(j => (
          <TableRow key={j.id}>
            <TableCell>{j.name}</TableCell>
            <TableCell>{j.accessKey}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ListAssistants;

// @flow

import React, { PureComponent } from 'react';
import {
  Header,
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableHeaderCell,
  TableCell,
  Grid,
  Container
} from 'semantic-ui-react';

export type ColumnViewModel = {
  title: string,
  scores: Array<ScoreViewModel>
};

export type ScoreViewModel = {
  name: string,
  value: number
};

export type NoteTableProps = {
  columns: Array<ColumnViewModel>
};

class NoteTable extends PureComponent<NoteTableProps> {
  _createTable = (column: ColumnViewModel) => {
    return (
      <Container>
        <Header as="h3">{column.title}</Header>
        <Table unstackable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {column.scores.map((score, i) => (
              <TableRow key={score.name}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{score.name}</TableCell>
                <TableCell>{score.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
  };
  render() {
    return (
      <Grid columns={this.props.columns.length} stackable>
        {this.props.columns.map(col => (
          <Grid.Column key={col.title}>{this._createTable(col)}</Grid.Column>
        ))}
      </Grid>
    );
  }
}

export default NoteTable;

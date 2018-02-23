// @flow

import React, { PureComponent } from 'react';
import {
  Header,
  Modal,
  ModalActions,
  Button,
  ModalContent,
  ModalHeader,
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableHeaderCell,
  TableCell,
  Grid,
  GridColumn
} from 'semantic-ui-react';

export type StateProps = {
  columns: Array<ColumnViewModel>,
  tournamentId: string,
  notes: Array<JudgeNote>
};

export type ColumnViewModel = {
  title: string,
  scores: Array<ScoreViewModel>
};

export type ScoreViewModel = {
  name: string,
  value: number
};

export type DispatchProps = {
  onSubmit: (tournamentId: string, notes: Array<JudgeNote>) => void
};

type Props = StateProps & DispatchProps;

class SubmitNotesModal extends PureComponent<Props> {
  _onSubmit = () => {
    this.props.onSubmit(this.props.tournamentId, this.props.notes);
  };

  render() {
    return (
      <Modal trigger={<Button>Vérifier les notes</Button>}>
        <ModalHeader>Vérifier les notes</ModalHeader>
        <ModalContent>
          <Grid columns={this.props.columns.length} stackable>
            {this.props.columns.map(col => (
              <NoteColumn key={col.title} {...col} />
            ))}
          </Grid>
        </ModalContent>
        <ModalActions>
          <Button color="green" type="submit" onClick={this._onSubmit}>
            Valider les notes
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

// eslint-disable-next-line
class NoteColumn extends PureComponent<ColumnViewModel> {
  render() {
    return (
      <GridColumn>
        <Header as="h3">{this.props.title}</Header>
        <Table unstackable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Score</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.scores.map((score, i) => (
              <TableRow key={score.name}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{score.name}</TableCell>
                <TableCell>{score.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GridColumn>
    );
  }
}

export default SubmitNotesModal;

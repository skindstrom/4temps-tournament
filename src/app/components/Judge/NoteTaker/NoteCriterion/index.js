// @flow
import React from 'react';
import {
  Icon,
  FormField,
  FormRadio,
  Table,
  TableBody,
  TableRow,
  TableCell
} from 'semantic-ui-react';

export type StateProps = {
  notedEntity: string,
  criterion: CriterionViewModel
};

export type CriterionViewModel = {
  id: string,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  value: ?number
};

export type DispatchProps = {
  onClick: (value: number) => void
};

type Props = StateProps & DispatchProps;

function NoteCriterion({ notedEntity, criterion, onClick }: Props) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <FormField>
              {criterion.name}
              <Icon name="info circle" />
            </FormField>
          </TableCell>
          {getRange(criterion.minValue, criterion.maxValue).map(val => (
            <TableCell key={notedEntity + criterion.id + val}>
              <FormRadio
                label={String(val)}
                value={val}
                checked={criterion.value === val}
                onChange={(
                  e: SyntheticEvent<*>,
                  { value }: { value: number }
                ) => onClick(value)}
              />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

function getRange(minValue: number, maxValue: number) {
  return Array.from(
    { length: maxValue + Math.abs(minValue) + 1 },
    (v, i) => minValue + i
  );
}

export default NoteCriterion;

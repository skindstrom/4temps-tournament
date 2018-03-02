// @flow
import React from 'react';
import {
  Icon,
  FormField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Popup
} from 'semantic-ui-react';

import './styles.css';

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
              <span styleName="text">
                {criterion.name}
                {'    '}
                <Popup
                  trigger={<Icon name="info circle" />}
                  header="Description"
                  content={criterion.description}
                  on={['hover']}
                />
              </span>
            </FormField>
          </TableCell>
          {getRange(criterion.minValue, criterion.maxValue).map(val => (
            <TableCell key={notedEntity + criterion.id + val}>
              <div className="field ui ">
                <input
                  id={criterion.id}
                  styleName="radio"
                  type="radio"
                  value={val}
                  checked={criterion.value === val}
                  onChange={() => onClick(val)}
                />
                <label htmlFor={criterion.id} styleName="text">
                  {val}
                </label>
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

function getRange(minValue: number, maxValue: number) {
  return Array.from(
    { length: maxValue - minValue + 1 },
    (v, i) => minValue + i
  );
}

export default NoteCriterion;

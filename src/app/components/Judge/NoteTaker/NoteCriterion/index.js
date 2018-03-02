// @flow
import React from 'react';
import {
  Segment,
  Icon,
  Grid,
  GridRow,
  GridColumn,
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
    <Segment color={criterion.value == null ? 'red' : null}>
      <Grid padded>
        <GridRow>
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
        </GridRow>
        <GridRow columns="equal">
          {getRange(criterion.minValue, criterion.maxValue).map(val => (
            <GridColumn key={notedEntity + criterion.id + val}>
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
            </GridColumn>
          ))}
        </GridRow>
      </Grid>
    </Segment>
  );
}

function getRange(minValue: number, maxValue: number) {
  return Array.from(
    { length: maxValue - minValue + 1 },
    (v, i) => minValue + i
  );
}

export default NoteCriterion;

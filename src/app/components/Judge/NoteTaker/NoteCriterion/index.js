// @flow
import React from 'react';
import {
  Input,
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
  value: ?number,
  forJudgeType: JudgeType
};

export type DispatchProps = {
  onClick: (value: ?number) => void
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
        {criterion.forJudgeType === 'normal' ? (
          <NormalInput
            criterion={criterion}
            notedEntity={notedEntity}
            onClick={onClick}
          />
        ) : (
          <SanctionerInput
            criterion={criterion}
            notedEntity={notedEntity}
            onClick={onClick}
          />
        )}
      </Grid>
    </Segment>
  );
}

function NormalInput({ notedEntity, criterion, onClick }: Props) {
  return (
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
  );
}

function SanctionerInput({
  criterion,
  onClick
}: {
  criterion: CriterionViewModel,
  onClick: (val: ?number) => void
}) {
  return (
    <GridRow>
      <Input
        label={{ basic: true, content: '%' }}
        labelPosition="right"
        value={criterion.value == null ? '' : criterion.value}
        onChange={(_, { value }) => {
          const asInt = parseInt(value, 10);

          if (isNaN(asInt)) {
            onClick(null);
          }

          if (isInRange(criterion.minValue, criterion.maxValue, asInt)) {
            onClick(asInt);
          }
        }}
      />
    </GridRow>
  );
}

function isInRange(min: number, max: number, val: ?number) {
  return val != null && min <= val && val <= max;
}

function getRange(minValue: number, maxValue: number) {
  return Array.from(
    { length: maxValue - minValue + 1 },
    (v, i) => minValue + i
  );
}

export default NoteCriterion;

// @flow

import React from 'react';
import { Grid, GridRow, GridColumn, Header, Button } from 'semantic-ui-react';

type Props = StateProps & DispatchProps;

export type StateProps = {
  upperLayerPairs: Array<?PairViewModel>,
  lowerLayerPairs: Array<?PairViewModel>,
  activePairId: string
};

export type DispatchProps = {
  onClickPair: (id: string) => void
};

export type PairViewModel = {
  id: string,
  name: string,
  hasAllNotes: boolean
};

function SelectPairGrid(props: Props) {
  return (
    <Grid padded>
      <GridRow>
        <Header as="h3">Placements des couples</Header>
      </GridRow>
      <GridRow columns={props.upperLayerPairs.length}>
        {renderColumns(
          props.upperLayerPairs,
          props.activePairId,
          props.onClickPair
        )}
      </GridRow>
      <GridRow columns={props.lowerLayerPairs.length}>
        {renderColumns(
          props.lowerLayerPairs,
          props.activePairId,
          props.onClickPair
        )}
      </GridRow>
    </Grid>
  );
}

function renderColumns(
  pairs: Array<?PairViewModel>,
  activeId: string,
  onClick: (id: string) => void
) {
  return pairs.map(
    (pair, i) =>
      pair == null ? (
        // eslint-disable-next-line
        <GridColumn key={i} />
      ) : (
        <PairGridColumn
          key={pair.id}
          pair={pair}
          // $FlowFixMe
          onClick={() => onClick(pair.id)}
          isActive={pair.id === activeId}
        />
      )
  );
}

type PairButtonProps = {
  pair: PairViewModel,
  onClick: (id: string) => void,
  isActive: boolean
};

function PairGridColumn({ pair, onClick, isActive }: PairButtonProps) {
  const color = isActive ? 'blue' : pair.hasAllNotes ? 'green' : null;
  return (
    <GridColumn textAlign="center">
      <Button color={color} onClick={onClick}>
        {pair.name}
      </Button>
    </GridColumn>
  );
}

export default SelectPairGrid;

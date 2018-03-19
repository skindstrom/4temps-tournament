// @flow
import React from 'react';
import { Grid, GridRow, Header } from 'semantic-ui-react';
import NoteCriterion from '../NoteCriterion';

export type StateProps = {
  tournamentId: string,
  judgeId: string,
  danceId: string,
  pairId: string,
  criteria: Array<CriterionViewModel>
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
  onClick: (tournamentId: string, note: JudgeNote) => void
};

type Props = StateProps & DispatchProps;

function PairNoteTaker({
  pairId,
  criteria,
  onClick,
  tournamentId,
  judgeId,
  danceId
}: Props) {
  return (
    <Grid centered>
      <GridRow>
        <Header as="h2">Couple</Header>
      </GridRow>
      {criteria.map(criterion => (
        <GridRow key={pairId + criterion.id}>
          <NoteCriterion
            notedEntity={pairId}
            onClick={(value: number) =>
              onClick(tournamentId, {
                danceId,
                judgeId,
                participantId: pairId,
                criterionId: criterion.id,
                value
              })
            }
            criterion={criterion}
          />
        </GridRow>
      ))}
    </Grid>
  );
}

export default PairNoteTaker;

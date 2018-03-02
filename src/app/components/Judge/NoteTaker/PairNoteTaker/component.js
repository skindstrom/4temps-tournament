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
    <Grid>
      <GridRow>
        <Header as="h2">Couple</Header>
      </GridRow>
      <GridRow>
        {criteria.map(criterion => (
          <NoteCriterion
            key={pairId + criterion.id}
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
        ))}
      </GridRow>
    </Grid>
  );
}

export default PairNoteTaker;

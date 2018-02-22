// @flow
import React from 'react';
import { Grid } from 'semantic-ui-react';
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
    </Grid>
  );
}

export default PairNoteTaker;

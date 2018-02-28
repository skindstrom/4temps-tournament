// @flow

import React from 'react';
import type { RouterHistory } from 'react-router-dom';
import ListRounds from './ListRounds';

type Props = {
  tournamentId: string,
  history: RouterHistory
};

function EditTournamentRounds({ tournamentId, history }: Props) {
  return (
    <ListRounds tournamentId={tournamentId} history={history} />
  );
}

export default EditTournamentRounds;

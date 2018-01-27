// @flow

import { connect } from 'react-redux';
import { createRound } from '../../../../api/round';
import Component from './component';

type Props = {
  tournamentId: string
}

function mapStateToProps({ ui }: ReduxState) {
  return ui.createRound;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: (round: Round) =>
      dispatch({
        type: 'CREATE_ROUND',
        promise: createRound(tournamentId, round)
      })
  };
}

const EditTournamentRoundsContainer =
  connect(mapStateToProps, mapDispatchToProps)(Component);

export default EditTournamentRoundsContainer;
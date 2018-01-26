// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { getRounds, deleteRound } from '../../../../api/round';

type Props = {
  tournamentId: string
}

function mapStateToProps({ rounds }: ReduxState,
  { tournamentId }: Props) {
  return {
    Child: List,
    shouldLoad: !rounds.forTournament[tournamentId],
    rounds:
      (rounds.forTournament[tournamentId] || [])
        .map(id => rounds.byId[id]),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: () => dispatch(
      {type: 'GET_ROUNDS', promise: getRounds(tournamentId)}
    ),
    deleteFromRounds: (deleteId: string) => dispatch({
      type: 'DELETE_ROUND',
      promise: deleteRound(deleteId)
    })
  };
}

const ListRoundContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListRoundContainer;

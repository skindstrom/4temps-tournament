// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { deleteRound } from '../../../../api/round';
import { getTournamentsForUser } from '../../../../api/tournament';

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
      {type: 'GET_USER_TOURNAMENTS', promise: getTournamentsForUser()}
    ),
    deleteFromRounds: (deleteId: string) => dispatch({
      type: 'DELETE_ROUND',
      promise: deleteRound(tournamentId, deleteId)
    })
  };
}

const ListRoundContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListRoundContainer;

// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { deleteRound, startRound } from '../../../../api/round';
import { getTournamentsForUser } from '../../../../api/tournament';

type Props = {
  tournamentId: string
}

function mapStateToProps({ rounds }: ReduxState,
  { tournamentId }: Props) {

  const tournamentRounds =
    (rounds.forTournament[tournamentId] || [])
      .map(id => rounds.byId[id]);

  const nextRound = tournamentRounds.find(({ finished }) => !finished);

  return {
    Child: List,
    shouldLoad: !rounds.forTournament[tournamentId],
    rounds: tournamentRounds,
    nextRound: nextRound ? nextRound.id : null
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
    }),
    startRound: (roundId: string) => dispatch({
      type: 'START_ROUND',
      promise: startRound(tournamentId, roundId)
    })
  };
}

const ListRoundContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListRoundContainer;

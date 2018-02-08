// @flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import PreloadContainer from '../../../PreloadContainer';
import List from './component';
import { deleteRound, startRound } from '../../../../api/round';
import { getTournamentsForUser } from '../../../../api/tournament';

type Props = {
  tournamentId: string,
  history: RouterHistory
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

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, history }: Props) {

  return {
    load: () => dispatch(
      {type: 'GET_ADMIN_TOURNAMENTS', promise: getTournamentsForUser()}
    ),
    deleteFromRounds: (deleteId: string) => dispatch({
      type: 'DELETE_ROUND',
      promise: deleteRound(tournamentId, deleteId)
    }),
    startRound: (roundId: string) => dispatch({
      type: 'START_ROUND',
      promise: startRound(tournamentId, roundId),
      meta: {
        onSuccess: () => history.push(`/round/${roundId}`)
      }
    }),
    onClick: (roundId: string) => history.push(`/round/${roundId}`)
  };
}

const ListRoundContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListRoundContainer;

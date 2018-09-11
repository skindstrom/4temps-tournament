// @flow
import { connect } from 'react-redux';

import ListParticipants from './component';
import PreloadContainer from '../../../PreloadContainer';
import { changeAttendance } from '../../../../api/participant';
import {
  getAdminTournaments,
  getSingleTournament
} from '../../../../action-creators';

type Props = {
  tournamentId: string
};

function mapStateToProps(
  { user, tournaments, participants }: ReduxState,
  { tournamentId }: Props
) {
  const shouldLoad = !participants.forTournament[tournamentId];
  return {
    Child: ListParticipants,
    shouldLoad,
    participants: (participants.forTournament[tournamentId] || []).map(
      id => participants.byId[id]
    ),
    isClassic: !shouldLoad && tournaments.byId[tournamentId].type === 'classic',
    loadArgs: user.role !== 'admin' ? user.tournamentId : null
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: tournamentId => {
      if (tournamentId) {
        getSingleTournament(dispatch, tournamentId);
      } else {
        getAdminTournaments(dispatch);
      }
    },
    onChangeAttending: (id, isAttending) =>
      dispatch({
        type: 'CHANGE_ATTENDANCE',
        promise: changeAttendance(tournamentId, id, isAttending)
      })
  };
}

const ListParticipantsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer);

export default ListParticipantsContainer;

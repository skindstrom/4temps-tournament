// @flow
import { connect } from 'react-redux';

import ListParticipants from './component';
import PreloadContainer from '../../../PreloadContainer';
import { changeAttendance } from '../../../../api/participant';
import { getAdminTournaments } from '../../../../action-creators';

type Props = {
  tournamentId: string
};

function mapStateToProps(
  { participants }: ReduxState,
  { tournamentId }: Props
) {
  return {
    Child: ListParticipants,
    shouldLoad: !participants.forTournament[tournamentId],
    participants: (participants.forTournament[tournamentId] || []).map(
      id => participants.byId[id]
    )
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: () => getAdminTournaments(dispatch),
    onChangeAttending: (id, isAttending) =>
      dispatch({
        type: 'CHANGE_ATTENDANCE',
        promise: changeAttendance(tournamentId, id, isAttending)
      })
  };
}

const ListParticipantsContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default ListParticipantsContainer;

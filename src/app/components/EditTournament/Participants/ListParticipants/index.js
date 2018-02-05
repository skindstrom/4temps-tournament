// @flow
import { connect } from 'react-redux';

import ListParticipants from './component';
import PreloadContainer from '../../../PreloadContainer';
import { getTournamentsForUser } from '../../../../api/tournament';

type Props = {
  tournamentId: string
}

function mapStateToProps({ participants }: ReduxState,
  { tournamentId }: Props) {
  return {
    Child: ListParticipants,
    shouldLoad: !participants.forTournament[tournamentId],
    participants:
      (participants.forTournament[tournamentId] || [])
        .map(id => participants.byId[id]),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () => dispatch(
      {type: 'GET_ADMIN_TOURNAMENTS', promise: getTournamentsForUser()}
    )
  };
}

const ListParticipantsContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListParticipantsContainer;

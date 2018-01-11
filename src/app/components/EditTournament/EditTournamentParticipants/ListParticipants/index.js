// @flow
import { connect } from 'react-redux';

import ListParticipants from './component';
import PreloadContainer from '../../../PreloadContainer';
import { getParticipants } from '../../../../api/participant';

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

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    load: () => dispatch(
      {type: 'GET_PARTICIPANTS', promise: getParticipants(tournamentId)}
    )
  };
}

const ListParticipantsContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListParticipantsContainer;
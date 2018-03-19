// @flow
import { connect } from 'react-redux';

import CreateParticipant from './component';
import type { State as ComponentState } from './component';
import { createParticipant } from '../../../../api/participant';

type Props = {
  tournamentId: string
};

function mapStateToProps(
  { tournaments, ui }: ReduxState,
  { tournamentId }: Props
) {
  return {
    ...ui.createParticipant,
    isClassic:
      tournaments.byId[tournamentId] != null &&
      tournaments.byId[tournamentId].type === 'classic'
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: ({ name, role }: ComponentState) =>
      dispatch({
        type: 'CREATE_PARTICIPANT',
        promise: createParticipant(tournamentId, {
          id: '',
          name,
          role,
          attendanceId: 0, // generate on server side
          isAttending: false
        })
      })
  };
}

const CreateParticipantContainer = connect(mapStateToProps, mapDispatchToProps)(
  CreateParticipant
);

export default CreateParticipantContainer;

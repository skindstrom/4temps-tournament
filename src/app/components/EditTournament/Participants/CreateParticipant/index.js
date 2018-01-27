// @flow
import { connect } from 'react-redux';
import ObjectId from 'bson-objectid';

import CreateParticipant from './component';
import type { State as ComponentState } from './component';
import { createParticipant } from '../../../../api/participant';

type Props = {
  tournamentId: string
}

function mapStateToProps({ ui }: ReduxState) {
  return ui.createParticipant;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: ({ name, role }: ComponentState) => dispatch({
      type: 'CREATE_PARTICIPANT',
      promise: createParticipant(tournamentId, {
        _id: ObjectId.generate(),
        name, role
      })
    })
  };
}

const CreateParticipantContainer =
  connect(mapStateToProps, mapDispatchToProps)(CreateParticipant);

export default CreateParticipantContainer;
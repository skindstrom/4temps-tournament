// @flow

import { connect } from 'react-redux';
import Component from './component';
import { createAssistant } from '../../../../api/assistant';

type Props = {
  tournamentId: string
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.createAssistant;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { tournamentId }: Props) {
  return {
    onSubmit: (name: string) =>
      dispatch({
        type: 'CREATE_ASSISTANT',
        promise: createAssistant(tournamentId, { id: '', name })
      })
  };
}

const CreateAssistantContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default CreateAssistantContainer;

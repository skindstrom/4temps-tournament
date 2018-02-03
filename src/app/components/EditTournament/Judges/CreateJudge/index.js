// @flow

import {connect} from 'react-redux';
import Component from './component';
import createJudge from '../../../../api/judge';

type Props = {
  tournamentId: string
}

function mapStateToProps({ui}: ReduxState) {
  return ui.createJudge;
}

function mapDispatchToProps(dispatch: ReduxDispatch, {tournamentId}: Props) {
  return {
    onSubmit: (name: string) => dispatch({
      type: 'CREATE_JUDGE',
      promise: createJudge(tournamentId, {id: '', name})
    })
  };
}

const CreateJudgeContainer =
  connect(mapStateToProps, mapDispatchToProps)(Component);

export default CreateJudgeContainer;

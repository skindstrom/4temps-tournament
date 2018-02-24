//@flow
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { loginJudge } from '../../../api/judge';
import LoginComponent from './component';

type Props = {
  history: RouterHistory
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.judgeLogin;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    onSubmit: (accessKey: string) =>
      dispatch({
        type: 'LOGIN_WITH_ACCESS_KEY',
        promise: loginJudge(accessKey),
        meta: {
          onSuccess: () => history.push('/')
        }
      })
  };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(
  LoginComponent
);

export default LoginContainer;

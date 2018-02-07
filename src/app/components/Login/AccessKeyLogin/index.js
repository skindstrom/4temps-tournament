//@flow
import { connect } from 'react-redux';
import { loginJudge } from '../../../api/judge';
import LoginComponent from './component';


function mapStateToProps({ ui }: ReduxState) {
  return ui.judgeLogin;
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    onSubmit: (accessKey: string) =>
      dispatch({
        type: 'LOGIN_WITH_ACCESS_KEY',
        promise: loginJudge(accessKey),
      })
  };
}

const LoginContainer =
  connect(mapStateToProps, mapDispatchToProps)(LoginComponent);

export default LoginContainer;

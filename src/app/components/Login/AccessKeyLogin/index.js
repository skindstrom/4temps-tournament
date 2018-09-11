//@flow
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { loginWithAccessKey } from '../../../api/access-key';
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
        promise: loginWithAccessKey(accessKey),
        meta: {
          onSuccess: () => history.push('/')
        }
      })
  };
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default LoginContainer;

import { connect } from 'react-redux';
import type { RouterHistory, Location } from 'react-router-dom';
import { loginJudge } from '../../../api/judge';
import LoginComponent from './component';


type Props = {
  location: Location,
  history: RouterHistory
}

function mapStateToProps({ ui }: ReduxState) {
  return ui.judgeLogin;
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { location, history }: Props) {
  const referer = location.search.replace(/\?referer=/, '');
  return {
    onSubmit: (accessKey: string) =>
      dispatch({
        type: 'LOGIN_WITH_ACCESS_KEY',
        promise: loginJudge(accessKey),
        meta: {
          onSuccess: () => alert('Judge successfully logged in!')
        }
      })
  };
}

const LoginContainer =
  connect(mapStateToProps, mapDispatchToProps)(LoginComponent);

export default LoginContainer;

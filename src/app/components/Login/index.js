// @flow

import { connect } from 'react-redux';
import type { RouterHistory, Location } from 'react-router-dom';

import LoginComponent from './component';
import { loginUser } from '../../api/user';

import type { UserCredentials } from '../../../models/user';


type Props = {
  location: Location,
  history: RouterHistory
}

function mapStateToProps(state: ReduxState) {
  return {
    ...state.uiLogin,
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { location, history }: Props) {
  const referer = location.search.replace(/\?referer=/, '');
  return {
    onSubmit: (credentials: UserCredentials) =>
      dispatch({
        type: 'LOGIN_USER',
        promise: loginUser(credentials),
        meta: {
          onSuccess: () => history.push(referer)
        }
      })
  };
}

const LoginContainer =
  connect(mapStateToProps, mapDispatchToProps)(LoginComponent);

export default LoginContainer;
/*
type State = {
  isValidInput: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  wasCorrectCredentials: boolean,
  isLoading: boolean
};

class LoginContainer extends PureComponent<Props, State> {
  state = {
    isValidInput: true,
    isValidEmail: false,
    isValidPassword: false,
    wasCorrectCredentials: false,
    isLoading: false
  };

  _onSubmit = async (credentials: UserCredentials) => {
    this.setState({ isLoading: true });
    const { result } = await loginUser(credentials);
    if (result != null) {
      const { isValid, isValidEmail, isValidPassword, doesUserExist } = result;
      this.setState({
        isValidInput: isValid,
        isValidEmail,
        isValidPassword,
        wasCorrectCredentials: doesUserExist,
        isLoading: false
      });

      if (isValid) {
        window.isAuthenticated = true;
        const referer = this.props.location.search.replace(/\?referer=/, '');
        this.props.history.push(referer);
      }

    }

  }

  render() {
    return (
      <LoginComponent
        {...this.state}
        onSubmit={this._onSubmit}
      />
    );
  }
}

export default LoginContainer;
*/
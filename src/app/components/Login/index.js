// @flow

import React, { PureComponent } from 'react';

import LoginComponent from './component';
import { loginUser } from '../../api/user';

import type { UserCredentials } from '../../../models/user';

type Props = {
  updatedAuthenticationState: () => void
}

type State = {
  isValidInput: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  wasCorrectCredentials: boolean,
};

class LoginContainer extends PureComponent<Props, State> {
  state = {
    isValidInput: true,
    isValidEmail: false,
    isValidPassword: false,
    wasCorrectCredentials: false
  };

  _onSubmit = async (credentials: UserCredentials) => {
    const { isValid, isValidEmail, isValidPassword, doesUserExist } =
      await loginUser(credentials);

    this.setState({
      isValidInput: isValid,
      isValidEmail,
      isValidPassword,
      wasCorrectCredentials: doesUserExist
    });

    if (isValid) {
      window.isAuthenticated = true;
      this.props.updatedAuthenticationState();
    }
  }

  render() {
    return (
      <LoginComponent
        {...this.state}
        onSubmit={this._onSubmit}
      />);
  }
}

export default LoginContainer;
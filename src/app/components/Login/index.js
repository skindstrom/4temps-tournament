// @flow

import React, { PureComponent } from 'react';

import LoginComponent from './component';
import validateUserLogin from '../../../validators/validate-user-login';

import type { UserCredentials } from '../../../models/user';
import type { UserLoginValidationSummary } from
  '../../../validators/validate-user-login';

type Props = {}
type State = UserLoginValidationSummary;

class LoginContainer extends PureComponent<Props, State> {
  state = {
    isValid: true,
    isValidEmail: true,
    isValidPassword: true
  };

  _onSubmit = (user: UserCredentials) => {
    this.setState(validateUserLogin(user));
  }

  render() {
    return (
      <LoginComponent
        validation={{ ...this.state }}
        onSubmit={this._onSubmit}
      />);
  }
}

export default LoginContainer;
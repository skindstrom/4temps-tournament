// @flow

import React, { PureComponent } from 'react';
import type { RouterHistory, Location } from 'react-router-dom';

import LoginComponent from './component';
import { loginUser } from '../../api/user';

import type { UserCredentials } from '../../../models/user';

type Props = {
  updatedAuthenticationState: () => void,
  location: Location,
  history: RouterHistory
}

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
    const { isValid, isValidEmail, isValidPassword, doesUserExist } =
      await loginUser(credentials);

    this.setState({
      isValidInput: isValid,
      isValidEmail,
      isValidPassword,
      wasCorrectCredentials: doesUserExist,
      isLoading: false
    });

    if (isValid) {
      window.isAuthenticated = true;
      this.props.updatedAuthenticationState();
      const referer = this.props.location.search.replace(/\?referer=/, '');
      this.props.history.push(referer);
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
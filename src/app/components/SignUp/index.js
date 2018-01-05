// @flow
import React, { Component } from 'react';
import type { Location, RouterHistory } from 'react-router-dom';

import SignUp from './component';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';
import type { UserWithPassword } from '../../../models/user';
import { createUser } from '../../api/user';

type Props = {
  history: RouterHistory,
  location: Location
};

type State = {
  validation: UserCreateValidationSummary,
  isLoading: boolean
};

class SignUpContainer extends Component<Props, State> {
  state = {
    validation: {
      isValid: false,
      isValidEmail: true,
      isEmailNotUsed: true,
      isValidFirstName: true,
      isValidLastName: true,
      isValidPassword: true
    },
    isLoading: false
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextState !== this.state;
  }

  _onSubmit = async (user: UserWithPassword) => {
    this.setState({ isLoading: true });
    const { result } = await createUser(user);
    if (result != null) {
      this.setState({ validation: result, isLoading: false });

      if (result.isValid) {
        this.props.history.push('/login' + this.props.location.search);
      }
    }
  };

  render() {
    return (
      <SignUp
        onSubmit={this._onSubmit}
        validation={this.state.validation}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default SignUpContainer;
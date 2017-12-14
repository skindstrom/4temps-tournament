// @flow
import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import type { RouterHistory } from 'react-router-dom';

import SignUp from './component';
import type { UserCreateValidationSummary } from
  '../../../validators/validate-user';
import type { UserWithPassword } from '../../../models/user';
import UserApi from '../../api/user';

type Props = {
  history: RouterHistory
};

type State = {
  validation: UserCreateValidationSummary
};

class SignUpContainer extends Component<Props, State> {
  state = {
    validation: {
      isValid: false,
      isValidEmail: true,
      isValidFirstName: true,
      isValidLastName: true,
      isValidPassword: true
    },
  };

  _onSubmit = async (user: UserWithPassword) => {
    const result = await UserApi.createUser(user);
    this.setState({ validation: result });

    if (result.isValid) {
      setTimeout(() => this.props.history.push('/login'), 1000);
    }
  };

  render() {
    return (
      <div>
        <Modal
          open={this.state.validation.isValid}
          header='Success!'
          content='Redirecting to login page...'
        />
        <SignUp
          onSubmit={this._onSubmit}
          validation={this.state.validation}
        />
      </div>);
  }
}

export default SignUpContainer;
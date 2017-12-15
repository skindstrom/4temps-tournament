// @flow

import React, { PureComponent } from 'react';
import { Button, Form, FormInput, Header, Message } from 'semantic-ui-react';
import type { UserLoginValidationSummary } from
  '../../../validators/validate-user-login';
import type { UserCredentials } from '../../../models/user';

import './styles.css';

type Props = {
  onSubmit: (user: UserCredentials) => void,
  validation: UserLoginValidationSummary
}
type State = UserCredentials;

class Login extends PureComponent<Props, State> {
  state = {
    email: '',
    password: ''
  };

  _onEmailChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  }

  _onPasswordChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  }

  _onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <div styleName="wrapper">
        <Header as='h1'>
          Log in
        </Header>
        <Form error={!this.props.validation.isValid}>
          <FormInput
            label='Email'
            placeholder='john@gmail.com'
            value={this.state.email}
            onChange={this._onEmailChange}
          />
          {!this.props.validation.isValidEmail &&
            <Message error content='Invalid email address' />}
          <FormInput
            label='Password'
            placeholder='P4ssw0rd'
            value={this.state.password}
            onChange={this._onPasswordChange}
          />
          {!this.props.validation.isValidPassword &&
            <Message error content='Invalid password' />}
          <Button
            type='submit'
            onClick={this._onSubmit}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
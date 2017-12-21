// @flow

import React, { PureComponent } from 'react';
import { Button, Form, FormInput, Header, Message, Loader } from
  'semantic-ui-react';
import type { UserCredentials } from '../../../models/user';

import './styles.css';

type Props = {
  onSubmit: (user: UserCredentials) => Promise<void>,
  isValidInput: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  wasCorrectCredentials: boolean,
  isLoading: boolean
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
        <Form
          loading={this.props.isLoading}
          error={!this.props.isValidInput}
        >
          <FormInput
            label='Email'
            placeholder='john@gmail.com'
            value={this.state.email}
            onChange={this._onEmailChange}
          />
          {!this.props.isValidEmail &&
            <Message error content='Invalid email address' />}
          <FormInput
            type='password'
            label='Password'
            placeholder='P4ssw0rd'
            value={this.state.password}
            onChange={this._onPasswordChange}
          />
          {!this.props.isValidPassword &&
            <Message error content='Invalid password' />}
          <Button
            type='submit'
            onClick={this._onSubmit}
          >
            Submit
          </Button>
          {!this.props.wasCorrectCredentials &&
            <Message error content='Invalid email or password' />}
        </Form>
      </div>
    );
  }
}

export default Login;
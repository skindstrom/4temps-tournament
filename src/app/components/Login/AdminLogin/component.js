// @flow

import React, { PureComponent } from 'react';
import { Button, Form, FormInput, Header, Message } from 'semantic-ui-react';
import type { AdminCredentials } from '../../../../models/admin';

import './styles.css';

type Props = {
  onSubmit: (admin: AdminCredentials) => Promise<void>,
  headerTitle: string,
  isValidInput: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesAdminExist: boolean,
  isLoading: boolean
};

type State = AdminCredentials;

class Login extends PureComponent<Props, State> {
  static defaultProps = {
    headerTitle: 'Log in'
  };

  state = {
    email: '',
    password: ''
  };

  _onEmailChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  _onPasswordChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  _onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <div styleName="center">
        <div styleName="width">
          <Header as="h1">{this.props.headerTitle}</Header>
          <Form loading={this.props.isLoading} error={!this.props.isValidInput}>
            <FormInput
              label="Email"
              placeholder="john@gmail.com"
              value={this.state.email}
              onChange={this._onEmailChange}
            />
            {!this.props.isValidEmail && (
              <Message error content="Invalid email address" />
            )}
            <FormInput
              type="password"
              label="Password"
              placeholder="P4ssw0rd"
              value={this.state.password}
              onChange={this._onPasswordChange}
            />
            {!this.props.isValidPassword && (
              <Message error content="Invalid password" />
            )}
            <Button type="submit" onClick={this._onSubmit}>
              Submit
            </Button>
            {!this.props.doesAdminExist && (
              <Message error content="Invalid email or password" />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;

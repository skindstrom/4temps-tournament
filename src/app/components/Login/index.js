// @flow

import React, { PureComponent } from 'react';
import { Header, Form, FormInput, Button } from 'semantic-ui-react';

import './styles.css';

type Props = {}
type State = {
  email: string,
  password: string
};

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
    alert('Submit!');
  };

  render() {
    return (
      <div styleName="wrapper">
        <Header as='h1'>
        Log in
        </Header>
        <Form>
          <FormInput
            label='Email'
            placeholder='john@gmail.com'
            value={this.state.email}
            onChange={this._onEmailChange}
          />
          <FormInput
            label='Password'
            placeholder='P4ssw0rd'
            value={this.state.password}
            onChange={this._onPasswordChange}
          />
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